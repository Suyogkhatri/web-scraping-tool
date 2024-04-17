import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import {  extractDescription, extractprice, findCurrencySymbol, sleep } from '../utils';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent as HttpsAgent } from 'https';



export async function scrapeEcommerceProduct(url: string) { 
    
    if (!url) return;

    const scraperApiKey = process.env.SCRAPERAPI_KEY; // Replace with your ScraperAPI key
  const targetUrl = encodeURIComponent(url);
    
    

    let title;
    let currentPrice;
    let content;
    let originalPrice;
    let outofstock = false;
    let images;
    let imageUrl;
    let currency;
    let discountRate;
    let productdata: any;
    let description;
  
    
    
    

    try {
        // Attempt to fetch the page content with Axios
        const apiUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${targetUrl}`;
        const { data } = await axios.get(apiUrl);
        content = data;

        // If Axios fetch was successful and content is available
        if (content) {
            const $ = cheerio.load(content);

            // Extract data with Cheerio, checking multiple selectors for the title
            title = $('#productTitle').text().trim() || 
                    $('span.base[data-ui-id="page-title-wrapper"]').text().trim() ||
                    $('.pdp-mod-product-badge-title').text().trim()||
                    $('span.pdp-price_type_normal').text().trim();
 

            currentPrice = extractprice(
               // $('span.price.product-type-variable-price'),
                $('.priceToPay span.a-price-whole'),
                $('a.size.base.acolor-price'),
                $('.a-button-select .a-color-base'),
                $('span.price.product-type-simple-price'),
                $('span.pdp-price_type_normal'),
                $('a.price.a-text-price')
            );

            originalPrice = extractprice(
                //$('#priceblock_ourprice'),
                $('span.a-price.a-text-price .a-offscreen').first(),
               // $('.a-price-whole'),
                //$('span.a-price.a-text-price span.a-offscreen'),
               // $('#listPrice'),
                //$('#priceblock_dealprice'),
                $('.a-size-base.a-colour-price'),
                $('.old-price .price'),
                $('.pdp-price.pdp-price_type_deleted')

            );

             currentPrice = currentPrice.startsWith('.') ? currentPrice.substring(1) : currentPrice;
             currentPrice = currentPrice.replace(/[^\d,]/g, '');
             originalPrice = originalPrice.startsWith('.') ? originalPrice.substring(1) : originalPrice;
             originalPrice = originalPrice.replace(/[^\d,]/g, '');


            

            outofstock = $('.price-box.price-final_price.product-type-variable-price-out-of-stock').length > 0 || 
            $('#available span').text().trim().toLowerCase() === 'currently unavailable' || 
            $('.quantity-content-warning').text().trim().toLowerCase() === 'out of stock';
            
            images = $('#imageBLkFont').attr('data-a-dynamic-image') ||
                        $('#landingImage').attr('data-a-dynamic-image') ||
                        $('.fotorama__stage__frame img').attr('src') ||
                        $('.gallery-preview-panel__content img').attr('src') ||
                        $('.gallery-preview-panel__content img.gallery-preview-panel__image').attr('src') ||
                        '{}'
             try {
               
                imageUrl = images.startsWith('{') ? Object.keys(JSON.parse(images))[0] : images;
           
            } catch (error) {
               
                imageUrl = images; // Fallback to assuming images is a direct URL if parsing fails
                
            }

            currency = findCurrencySymbol($);

             discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "") ||
             $('.pdp-product-price__discount').text().replace(/[-%]/g, "");

             const discountAmountText = $('.product-label').text();
            const discountAmountMatch = discountAmountText.match(/(\d+)/);
            if (discountAmountMatch && !discountRate) { // Proceed if discount amount found and discountRate not directly available
                let discountAmount = parseFloat(discountAmountMatch[0]);
                let originalNum = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
                // Assuming currentPrice and originalprice are correctly extracted and are numerical values
                let discountPercentage = (discountAmount / originalNum) * 100;
                discountRate = discountPercentage.toFixed(2); // Convert to string, round to two decimal places
            }
            
            let parsedCurrentPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            let parsedOriginalPrice = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));

            // Ensure valid numbers for calculations (avoid NaN values)
            parsedCurrentPrice = isNaN(parsedCurrentPrice) ? 0 : parsedCurrentPrice;
            parsedOriginalPrice = isNaN(parsedOriginalPrice) ? 0 : parsedOriginalPrice;

            // Calculations for lowestprice, highestprice, and average
            const prices = [parsedCurrentPrice, parsedOriginalPrice]; // Use parsed prices
            const lowestprice = Math.min(...prices);
            const highestprice = Math.max(...prices);
            const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
             
            description = extractDescription($);
            productdata = {
                url,
                currency: currency  || '$',
                image: imageUrl,
                title,
                currentPrice: parsedCurrentPrice,
                originalPrice: parsedOriginalPrice,
                priceHistory: [], // Assuming this might be populated elsewhere or in future development
                discountRate: Number(discountRate),
                catagory: 'catagory',
                reviewCount: 0,
                stars: 0,
                outofstock: outofstock,
                description,
                lowestprice: lowestprice,
                highestprice: highestprice,
                average: average.toFixed(2), 
          
           }
             
        }

        // If title or currentPrice wasn't found using Cheerio, fallback to Puppeteer
        if (!title || !currentPrice || !originalPrice || !images || !description) {
           
            // console.log('Using Puppeteer for dynamic content...');
            // const browser = await puppeteer.launch();
            // const page = await browser.newPage();
            // await page.goto(url, { waitUntil: 'networkidle2' });
            // content = await page.content();
            // await browser.close(); 
            console.log('Using Puppeteer with ScraperAPI for dynamic content...');

// Load your ScraperAPI key from environment variables
            const scraperApiKey = process.env.SCRAPERAPI_KEY;

            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
                headless: true,
            });

            const page = await browser.newPage();

        
            // Modify the URL to use ScraperAPI
            // Ensure your original URL is fully encoded as a parameter to the ScraperAPI endpoint
            const targetUrl = encodeURIComponent(url);
            const scraperApiUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${targetUrl}`;

            await page.goto(scraperApiUrl, { waitUntil: 'networkidle2' });

            content = await page.content();
            await browser.close();

            const $ = cheerio.load(content);
            title = $('#productTitle').text().trim() || 
                    $('span.base[data-ui-id="page-title-wrapper"]').text().trim() ||
                    $('.pdp-mod-product-badge-title').text().trim()||
                    $('span.pdp-price_type_normal').text().trim();

            currentPrice = extractprice(
                //$('span.price.product-type-variable-price'),
                $('.priceToPay span.a-price-whole'),
                $('a.size.base.acolor-price'),
                $('.a-button-select .a-color-base'),
                $('span.price.product-type-simple-price'),
                $('span.pdp-price_type_normal'),
                $('a.price.a-text-price')
            );

            originalPrice = extractprice(
                //$('#priceblock_ourprice'),
                $('span.a-price.a-text-price .a-offscreen').first(),
                //$('.a-price-whole'),
                //$('#listPrice'),
                //$('#priceblock_dealprice'),
                $('.a-size-base.a-colour-price'),
                $('.old-price .price'),
                $('.pdp-price.pdp-price_type_deleted')

            );

            currentPrice = currentPrice.startsWith('.') ? currentPrice.substring(1) : currentPrice;
            currentPrice = currentPrice.replace(/[^\d,]/g, '');
            originalPrice = originalPrice.startsWith('.') ? originalPrice.substring(1) : originalPrice;
            originalPrice = originalPrice.replace(/[^\d,]/g, '');
            

            if (!currentPrice) {
                outofstock = true;
            } else {
                // Re-confirm the out-of-stock status now with dynamic content loaded
                outofstock = $('.price-box.price-final_price.product-type-variable-price-out-of-stock').length > 0 || 
                             $('#available span').text().trim().toLowerCase() === 'currently unavailable' ||
                             $('.quantity-content-warning').text().trim().toLowerCase() === 'out of stock';
            }   

            images = $('#imageBLkFont').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') ||
            $('.fotorama__stage__frame img').attr('src') ||
            $('.gallery-preview-panel__content img').attr('src') ||
            $('.gallery-preview-panel__content img.gallery-preview-panel__image').attr('src') ||
             '{ }'           

             try {
                imageUrl = images.startsWith('{') ? Object.keys(JSON.parse(images))[0] : images;
            } catch (error) {
                imageUrl = images; // Fallback to assuming images is a direct URL if parsing fails
            }

            currency = findCurrencySymbol($);

            
            

            discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "") ||
            $('.pdp-product-price__discount').text().replace(/[-%]/g, "");
              
            const discountAmountText = $('.product-label').text();
            const discountAmountMatch = discountAmountText.match(/(\d+)/);
            if (discountAmountMatch && !discountRate) { // Proceed if discount amount found and discountRate not directly available
                let discountAmount = parseFloat(discountAmountMatch[0]);
                let originalNum = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
                // Assuming currentPrice and originalprice are correctly extracted and are numerical values
                let discountPercentage = (discountAmount / originalNum) * 100;
                discountRate = discountPercentage.toFixed(2); // Convert to string, round to two decimal places
            }

            let parsedCurrentPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            let parsedOriginalPrice = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));

            // Ensure valid numbers for calculations (avoid NaN values)
            parsedCurrentPrice = isNaN(parsedCurrentPrice) ? 0 : parsedCurrentPrice;
            parsedOriginalPrice = isNaN(parsedOriginalPrice) ? 0 : parsedOriginalPrice;

            // Calculations for lowestprice, highestprice, and average
            const prices = [parsedCurrentPrice, parsedOriginalPrice]; // Use parsed prices
            const lowestprice = Math.min(...prices);
            const highestprice = Math.max(...prices);
            const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

            description = extractDescription($);

             productdata = {
                url,
                currency: currency  || '$',
                image: imageUrl,
                title,
                currentPrice: parsedCurrentPrice,
                originalPrice: parsedOriginalPrice,
                priceHistory: [], // Assuming this might be populated elsewhere or in future development
                discountRate: Number(discountRate),
                category: 'category',
                reviewCount: 0,
                stars: 0,
                outofstock: outofstock,
                description,
                lowestprice: lowestprice,
                highestprice: highestprice,
                average: average.toFixed(2), 
           
            }
        }

        // if (url.includes("daraz.com.np") || ("darza.") || ("darza")) {
        //     currentPrice = currentPrice.startsWith('.') ? '0' + currentPrice : currentPrice;
        //     originalprice = originalprice.startsWith('.') ? '0' + originalprice : originalprice;
        // }
        
        // Now ensure any further string manipulation is done before converting to numbers
        // let cleanedCurrentPrice = currentPrice.replace(/[^\d.]/g, ''); // Ensure this is a string operation
        // let cleanedOriginalPrice = originalprice.replace(/[^\d.]/g, ''); // Ensure this is a string operation
        
        // After cleaning, convert the prices to numbers
        // currentPrice = parseFloat(cleanedCurrentPrice);
        // originalprice = parseFloat(cleanedOriginalPrice);

        // currentPrice = currentPrice.startsWith('.') ? currentPrice.substring(1) : currentPrice;
        // currentPrice = currentPrice.replace(/[^\d,]/g, '');
        // originalprice = originalprice.startsWith('.') ? originalprice.substring(1) : originalprice;
        // originalprice = originalprice.replace(/[^\d,]/g, '');

        
        


    } catch (error) {
        // Enhanced error logging
        console.error('Error during scraping:', error instanceof Error ? error.message : error);
    }
     return productdata;
     //console.log(productdata)
    //console.log({ title, currentPrice, originalprice, outofstock,  imageUrl, currency, discountRate });
};
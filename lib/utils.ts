import { PriceHistoryItem, Product } from "@/types";
import { CheerioAPI } from 'cheerio';


const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;




export function extractprice(...elements: any) {
    console.log("Extracting prices from elements...");
    for (const element of elements) {
        const priceText = element.text().trim();
        console.log(`Found text: ${priceText}`);
        
        if (priceText) {
            // More robust regex to handle various price formats
            const cleanedPrice = priceText.replace(/[^0-9.,]/g, '').trim();
            if(cleanedPrice) {
                console.log(`Extracted price: ${cleanedPrice}`);
                return cleanedPrice;
            }
        }
    }
    console.log("No price extracted.");
    return '';
}

export function extractCurrency(element: any) {
    // Attempt to extract the text from the first matched element to avoid concatenation of multiple elements' texts
    const currencyText = element.first().text().trim();
    // Use a regex to match the first occurrence of non-digit characters
    const match = currencyText.match(/^[^\d]+/);
    return match ? match[0].trim() : '';
}

export function findCurrencySymbol($: CheerioAPI): string {
    const selectors = [
        '.a-price-symbol',
        '.pdp-price.pdp-price_type_normal.pdp-price_color_orange.pdp-price_size_xl',
        '.price.product-type-simple-price',
    ];

    for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
            // Now correctly passing only the element to extractCurrency
            const currency = extractCurrency(element);
            if (currency) return currency;
        }
    }
    return '';
}

export function extractDescription($: any) {
    // these are possible elements holding description of the product
    const selectors = [
      // ".a-unordered-list .a-list-item",
      // ".a-expander-content p",
      '#productDetails_techSpec_section_1 tr',
      'th.prodDetSectionEntry',
      'td.prodDetAttrValue',
      '.pdp-product-highlights li',
      '.pdp-mod-specification .specification-keys .key-li',
      '.product.attribute.desciption .value li',
      '.a-list-item',
      '.a-size-base prodDetAttrValue'
      // Add more selectors here if needed
    ];
  
    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        const textContent = elements
          .map((_: any, element: any) => $(element).text().trim())
          .get()
          .join("\n");
        return textContent;
      }
    }
  
    // If no matching elements were found, return an empty string
    return "";
  }
  
  export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];
  
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price > highestPrice.price) {
        highestPrice = priceList[i];
      }
    }
  
    return highestPrice.price;
  }
  
  export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];
  
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price < lowestPrice.price) {
        lowestPrice = priceList[i];
      }
    }
  
    return lowestPrice.price;
  }
  
  export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const average = sumOfPrices / priceList.length || 0;
  
    return average;
  }
  
  export const getEmailNotifType = (
    scrapedProduct: Product,
    currentProduct: Product
  ) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);
  
    if (scrapedProduct.currentPrice < lowestPrice) {
      return Notification.LOWEST_PRICE as keyof typeof Notification;
    }
    if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
      return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
    }
    if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
      return Notification.THRESHOLD_MET as keyof typeof Notification;
    }
  
    return null;
  };
  
  export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  
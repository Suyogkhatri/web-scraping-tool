"use server"
import { revalidatePath } from "next/cache";
import Product from "../models/product.models";
import { connectToDB } from "../mongoose";
import { scrapeEcommerceProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl: string) { 
    if(!productUrl) return;

    try {
        connectToDB();
       
        const scrapeProduct = await scrapeEcommerceProduct(productUrl);

        if(!scrapeProduct) return;


        
        let product = scrapeProduct;

        const existingProduct = await Product.findOne ({ url: scrapeProduct.url });

        if(existingProduct) {
            const updatePriceHistory: any = [
              ...existingProduct.priceHistory,  
              {price: scrapeProduct.currentPrice}
            ]

            product ={
                ...scrapeProduct,
                priceHistory: updatePriceHistory,
                lowestPrice: getLowestPrice(updatePriceHistory),
                hightesPrice: getHighestPrice(updatePriceHistory),
                averagePrice: getAveragePrice(updatePriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate({
            url: scrapeProduct.url,},
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/product/${newProduct.id}`);
    } catch (error: any) {
        throw new Error(`Failed to create or update product: ${error.message}`);
        
    }
    


}

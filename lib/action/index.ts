"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.models";
import { connectToDB } from "../mongoose";
import { scrapeEcommerceProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) { 
    if(!productUrl) return;

    try {
       await connectToDB();
       
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
                average: getAveragePrice(updatePriceHistory)
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

export async function getProductById(productId: string) {
    try {
        connectToDB();

        const product =await Product.findOne({_id: productId})

        if(!product) return null;

        return product;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProduct() {
    try {
        connectToDB();
        const products = await  Product.find();

        return products;
    } catch (error) {
        console.log(error);
        
    }
}
export async function getSimilarProduct(productId: string) {
    try {
        connectToDB();
        const currentProduct = await  Product.findById(productId);

        if(!currentProduct) return null;

        const similarProduct = await Product.find({
            _id: {$ne: productId},
        }).limit(3);

        return similarProduct;
    } catch (error) {
        console.log(error);
        
    }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            console.log("Product not found");
            return;
        }

        // Make sure the Users field is initialized and is an array
        if (!Array.isArray(product.Users)) {
            product.Users = [];
        }

        const userExists = product.Users.some((user: { email: string; }) => user.email === userEmail);

        if (!userExists) {
            product.Users.push({ email: userEmail });

            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");
            await sendEmail(emailContent, [userEmail]);
        }
    } catch (error) {
        console.error("Error in addUserEmailToProduct:", error);
    }
}


import Product from "@/lib/models/product.models";
import { connectToDB } from "@/lib/mongoose"
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeEcommerceProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const products = await Product.find({});

        if(!products) throw new Error("No product found");

        // scrape latest product details and updates
        // send notification 
        const updatedProduct = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapdProduct = await scrapeEcommerceProduct
                (currentProduct.url);

                if(!scrapdProduct) throw new Error("No prduct found");

                const updatedPriceHistory =[
                        ...currentProduct.priceHistory,  
                        {price: scrapdProduct.currentPrice}
                      ]
          
                const product ={
                ...scrapdProduct,
                 priceHistory: updatedPriceHistory,
                 lowestPrice: getLowestPrice(updatedPriceHistory),
                 hightesPrice: getHighestPrice(updatedPriceHistory),
                 average: getAveragePrice(updatedPriceHistory)
                      }
                  
          
                  const updatedProduct = await Product.findOneAndUpdate({
                      url: scrapdProduct.url,},
                      product,
                  );

                  // check each product status and send email accordingly
                  const emailNotifType = getEmailNotifType(scrapdProduct,
                    currentProduct)

                  if(emailNotifType && updatedProduct.users.length > 0){
                    const productInfo ={
                        title: updatedProduct.title ,
                        url: updatedProduct.url,
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotifType);

                    const userEmails = updatedProduct.users.map((user: any) => user.email)

                    await sendEmail(emailContent, userEmails);
                  }  

                  return updatedProduct;
                
            })


        )

        return NextResponse.json({
            message: 'Ok' , data: updatedProduct
        })

    } catch (error) {
      throw new Error(`Error in GET: ${error}`)  
    }
}
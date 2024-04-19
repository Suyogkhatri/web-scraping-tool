import Product from '@/lib/models/product.models';
import { connectToDB } from '@/lib/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Ensure the Stripe secret key is available, otherwise throw an error.


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("Stripe secret key is missing.");
  throw new Error("Stripe secret key is not configured.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use a date that's correct for the version of the Stripe API you're using
});



async function getProductDetails(productId: string) {
  // Look up the product by its ID in your database
  const product = await Product.findById(productId); // Using Mongoose's findById method

  if (!product) {
    return null; // Return null if no product is found
  }

  // Return the product details
  return {
    id: product.id,
    name: product.title, // Assuming your product model uses 'title' for the name
    imageUrl: product.image, // Assuming your product model uses 'image' for the image URL
    price: product.currentPrice * 100, // Convert to cents if stored as dollars
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  console.log("API route hit", req.method, req.url);
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    const product = await getProductDetails(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: product.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={session.id}`,
      cancel_url: `${req.headers.origin}/canceled?productId=${productId}`
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    if (err instanceof Stripe.errors.StripeError) {
      // Handling Stripe errors specifically
      console.error('Stripe error:', err);
      // Ensure statusCode is defined or default to 500
      const statusCode = err.statusCode ? err.statusCode : 500;
      res.status(statusCode).json({ error: err.message });
    } else {
      // Generic error handling for non-Stripe errors
      console.error('Unexpected error', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }}
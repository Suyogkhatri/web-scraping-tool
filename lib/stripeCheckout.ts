import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe.js with your Stripe public key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const handleBuyNowClick = async (productId: string) => { // Assuming productId should be a string
  if (!productId) {
    console.error("Product ID is undefined or invalid.");
    return;
  }
  console.log('Buy Now clicked, product ID:', productId);
  
  const stripe = await stripePromise;
  if (!stripe) {
    console.error("Stripe.js hasn't loaded yet.");
    return;
  }

  // Call your backend to create the checkout session
  try {
    const response = await fetch('app/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    const session = await response.json();

    // Redirect the customer to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // Log or display error message
      console.error("Checkout error:", result.error.message);
      alert("Error during checkout: " + result.error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert("Error setting up payment. Please try again.");
  }
};
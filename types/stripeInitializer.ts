// declare module 'khalti-checkout-web';
import { loadStripe } from '@stripe/stripe-js';

declare global {
    interface Window {
        customStripeLoader?: typeof loadStripe; // Use a unique name
    }
}
  
 
// import { useKhaltiPayment } from '@/hooks/useKhaltiPayment';
// import { Product } from '@/types';
// import React from 'react';

// interface KhaltiCheckoutButtonProps {
//   product: Product;
// }

// const KhaltiCheckoutButton: React.FC<KhaltiCheckoutButtonProps> = ({ product }) => {
//     // Use the custom hook to manage KhaltiCheckout
//     const checkout = useKhaltiPayment(product);

//     // If product is not available, display an error message
//     if (!product || product._id === undefined) {
//         return <div>Product is not available</div>;
//     }

//     // If checkout is not initialized, display a loading state
//     if (!checkout) {
//         return <button disabled>Loading payment options...</button>;
//     }

//     // Function to handle payment action
//     const handlePayment = () => {
//         checkout.show({ amount: product.currentPrice});
//     };

//     // Render the button
//     return <button onClick={handlePayment}>Buy Now</button>;
// };

// export default KhaltiCheckoutButton;
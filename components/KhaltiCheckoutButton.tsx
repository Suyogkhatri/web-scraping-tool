// 'use client'
// import React, { useEffect, useState } from 'react';
// import KhaltiCheckout from 'khalti-checkout-web';

// interface Product {
//   _id: string;
//   title: string;
//   currentPrice: number;
// }

// interface KhaltiCheckoutButtonProps {
//   product: Product;
// }

// export default function KhaltiCheckoutButton({ product }: KhaltiCheckoutButtonProps) {
//   const [checkout, setCheckout] = useState<any>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const config = {
//         publicKey: "test_public_key_74d5c8f1a7a44323a2d0e8531ca9f508",
//         productIdentity: product._id,
//         productName: product.title,
//         productUrl: `http://localhost:3000/product/${product._id}`,
//         eventHandler: {
//           onSuccess: (payload: any) => {
//             console.log("Payment Successful", payload);
//           },
//           // Add other event handlers as needed.
//         },
//         amount: product.currentPrice * 100,
//       };

//       setCheckout(new KhaltiCheckout(config));
//     }
//   }, [product]);


  
//   const handlePayment = () => {
//     checkout?.show({ amount: product.currentPrice * 100 });
//   };

//   return (
//     <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w[200px]" onClick={handlePayment}>
//       <span className="text-base text-white">Buy Now</span>
//     </button>
//   );
// }

 
//  // Ensure product is in the dependency array if its properties are used to configure KhaltiCheckout

//   // Define button or other UI elements to trigger Khalti checkout here

  

  

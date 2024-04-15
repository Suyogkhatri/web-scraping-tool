'use client'
// import dynamic from 'next/dynamic';
// import { handleBuyNowClick } from "@/lib/stripeCheckout";

import { handleBuyNowClick } from "@/lib/stripeCheckout";

// const BuyNowButton = ({ productId }: { productId?: string }) => {
//     return (
//       <button
//         className="btn w-fit mx-auto flex item-center justify-center gap-3 min-w[200px]"
//         onClick={() => handleBuyNowClick(productId)}
//       >
//         <span>Buy Now</span>
//       </button>
//     );
//   };
  
//   export default BuyNowButton;

 

const BuyNowButton = ({ productId }: { productId: string }) => {
  const handleClick = () => {
    // Assuming productId is a simple string here, no need to check its structure
    handleBuyNowClick(productId);
  };

  return (
    <button
      className="btn w-fit mx-auto flex item-center justify-center gap-3 min-w[200px]"
      onClick={handleClick}
    >
      <span>Buy Now</span>
    </button>
  );
};

  
  export default BuyNowButton;
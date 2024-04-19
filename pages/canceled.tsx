import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Canceled = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectPath = router.query.productId ? `/app/product/[id]/${router.query.productId}` : '/app/product/[id]/';
    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Payment Canceled</h1>
      <p>You will be redirected back to the product page shortly.</p>
      <button onClick={() => router.push(router.query.productId ? `/app/product/[id]/${router.query.productId}` : '/app/products/[id]')}>
        Return to Product
      </button>
    </div>
  );
};

export default Canceled;
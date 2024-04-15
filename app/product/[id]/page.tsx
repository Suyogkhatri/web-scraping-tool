
import { getProductById, getSimilarProduct } from '@/lib/action'
import { redirect } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatNumber } from '@/lib/utils'
import PriceinfoCard from '@/components/PriceinfoCard'
import ProductCard from '@/components/productCard'
import Modal from '@/components/Modal'
// import BuyNowButton, { DynamicBuyNowButton } from '@/components/BuyNowButton'
import dynamic from 'next/dynamic';



// import KhaltiCheckoutButton from '@/components/KhaltiCheckoutButton'

const DynamicBuyNowButton = dynamic(() => import('@/components/BuyNowButton'), {
  ssr: false,
});

type Props = {
  params: {id: string}
}
const productDetails = async ({params:{ id }} : Props) => {
  const product: Product = await getProductById(id);

  if(!product) redirect('/')
  
  const similarProduct = await getSimilarProduct(id);

  // function handleBuyNowClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
  //   throw new Error('Function not implemented.')
  // }


  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
          src={product.image}
          alt={product.title}
          width={580}
          height={400}
          className="mx-auto"
          />


        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className = "text-[28px] text-secondary font-semibold">
                {product.title}
              </p>

              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                visit Product
              
              </Link>

            </div>

            <div className="flex item-center gap-3">

              <div className="p-2 bg-pink-200 rounded-10">

                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />


                
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>

            </div>

          </div>

          <div className ="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[22px] text-black opacity-50 line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>

            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src ="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}

                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || '25'}
                  </p>

                </div>

                <div className="peoduct-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount} Reviews
                  </p>

                </div>
              </div>

              <p className="text-sm text-black opicity-50">
                <span className="text-primary-green font-semibold"> Majority of people have liked this product</span> 
              </p>
            </div>
          </div>

          <div className="my-7">
  <div className="grid grid-cols-2 gap-5">
              <PriceinfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                
              />
              <PriceinfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(product.average)}`}
                
              />
              <PriceinfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(product.highestprice)}`}
                
              />
              <PriceinfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(product.lowestprice)}`}
                
              />


            </div>
          </div>

          <Modal productId={id} />


        </div>
      </div> 

      <div className="flex flex-col gap-16 ">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>

          <ul className="list-disc pl-5">
      {product?.description?.split("\n").map((line, index) => (
        <li key={index}>{line}</li>
      ))}
    </ul>

        </div>

        <DynamicBuyNowButton productId={product._id ? product._id.toString() : 'defaultProductId'} />
         {/* <KhaltiCheckoutButton product={product} /> */}
        {/* <button className="btn w-fit mx-auto flex item-center justify-center gap-3 min-w[200px]"
              >
        <Image
          src="/assets/icons/bag.svg"
          alt="check"
          width={22}
          height={22}
        />
        <span className="text-base text-white">Buy Now</span>
      </button> */}
      </div>

      {similarProduct && similarProduct?.length > 0 && (
          <div className="py-14 flex flex-col gap-2 w-full">
            <p className="section-text"> Scraped Products History </p>

            
            <div className="flex flex-wrap gap mt-7 w-full">
              {similarProduct.map((product) => (
                <ProductCard key={product._id} product={product}/>
              ))}
            </div>


          </div>
      ) }


    </div>
  )
}

export default productDetails
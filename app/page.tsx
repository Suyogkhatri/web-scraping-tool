import HeroCarousel from "@/components/HeroCarousel"
import Searchbar from "@/components/Searchbar"
import Image from "next/image"
import { ReactNode } from "react"

const Home = () => {
  function product(value: string, index: number, array: string[]): ReactNode {
    throw new Error("Function not implemented.")
  }

  return (
    <>
    <section className="px-8 md:px-23 py-24 ">
      <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              E-commerce price tracking starts Here:
              <Image
                src=" /assets/icons/arrow-right.svg"
                alt=" arrow-right"
                width={17}
                height={17}
               />
            </p>

            <h1 className= "head-text">
              start price tracking with 
              <span className="text-primary"> RightPrice 
              </span>
            </h1>

                <p className="mt-6">
                RightPrice is a user-friendly web scraping tool designed for 
                e-commerce price tracking. It helps you monitor product prices, 
                offers real-time alerts,and provides insights to ensure you always 
                get the best deal.Stay ahead in the market with RightPrice's efficient 
                and reliable price monitoring.
                </p>

                <Searchbar />
          </div>

          <HeroCarousel />
      </div>
    </section>

    <section className="trending-section">
      <h2 className="section-text">Trending</h2>

      <div className="flex flex-wrap gap-x-8 gap-y-16">
        {[ 'Apple Iphone 15','Book', 'perfumes'].map
        ((product) => (
          <div>{product}</div>
        ))}        
      </div>
    </section>
    </>
  )
}

export default Home
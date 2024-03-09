"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const heroImages = [
    { imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
    { imgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
    { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
    { imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
    { imgUrl: '/assets/images/hero-5.svg', alt: 'chair'},
    { imgUrl: '/assets/images/hero-6.svg', alt: 'guitar'}
   
]

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
     <Carousel
         showThumbs={false}
         autoPlay
         infiniteLoop
         interval={3000}
         showArrows={false}
         showStatus={false}
     >
        {heroImages.map((image) => (
            <Image 
                src={image.imgUrl}
                alt={image.alt}
                width={500}
                height={500}
                className="object-contain"
                key={image.alt}
            />
        ))}
     </Carousel>
     <Image
      src="assets/icons/hand-drawn-arrow.svg"
      alt ="arrow"
      height={180}
      width={180}   
      className="max-xl:hidden absolute -left-[15%] bottom-0 
      z-0" 
     />
    </div>
  )
}

export default HeroCarousel
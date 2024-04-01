/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      //serverActions: true,
      serverComponentsExternalPackages: ['mongoose']
    },
    images: {
      domains: ['m.media-amazon.com', 'm.media-amazon.in'
      , 'static-01.daraz.com.np', 'static.sastodeal.com', 'laz-img-cdn.alicdn.com']
      
    }
  }
  
module.exports = nextConfig
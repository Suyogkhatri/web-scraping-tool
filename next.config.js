const nextConfig = {
  experimental: {
    //serverActions: true,
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    remotePatterns: [
      { hostname: 'm.media-amazon.com' },
      { hostname: 'm.media-amazon.in' },
      { hostname: 'static-01.daraz.com.np' },
      { hostname: 'static.sastodeal.com' },
      { hostname: 'laz-img-cdn.alicdn.com' }
    ]
  }
}

module.exports = nextConfig;
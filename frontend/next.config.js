// next.config.js
module.exports = {
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'http://139.59.38.84:3000/:path*',
          },
        ]
      },
  };
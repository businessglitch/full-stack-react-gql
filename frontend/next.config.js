// next.config.js
module.exports = {
    async rewrites() {
        return [
          {
            source: 'http://139.59.38.84:7777/*',
            destination: 'http://139.59.38.84:3000/*',
          },
        ]
      },
  };
// next.config.js
module.exports = {
    async headers() {
        return [
            {
                source: '/(.*?)',
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*"
                    }
                ]
            }
        ]
    },
  };
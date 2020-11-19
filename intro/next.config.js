module.exports = {
    async headers() {
      return [
        {
          source: '/api/cas/serviceValidate',
          headers: [
            {
              key: 'Content-Type',
              value: 'text/xml',
            }
          ],
        },
        {
            source: '/api/cas/proxyValidate',
            headers: [
              {
                key: 'Content-Type',
                value: 'text/xml',
              }
            ],
          },
      ]
    },
    async rewrites() {
        return [
          {
            source: '/api/cas/proxyValidate',
            destination: '/api/cas/serviceValidate',
          },
        ]
      },
  }
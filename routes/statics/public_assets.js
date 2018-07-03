const publicAssets = {
    method: 'GET',
    path: '/public_assets/{path*}',
    options: {
      auth: false,
      handler: {
        directory: {
          path: './public_assets',
          listing: false,
          index: false
        }
      }
    }
}

export default publicAssets
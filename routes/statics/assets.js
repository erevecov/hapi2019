const Assets = {
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      handler: {
        directory: {
          path: './assets',
          listing: false,
          index: false
        }
      }
    }
}

export default Assets
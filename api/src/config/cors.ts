import cors from 'cors'

/**
 * Cors configuration options that allows users to retrieve images
 */
const corsOptions: cors.CorsOptions = {
  origin: function (_origin, callback): void {
    callback(null, true)
  },
  methods: 'GET'
}

export default corsOptions
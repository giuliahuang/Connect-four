import cors from 'cors'

export const corsImages: cors.CorsOptions = {
  origin: function (_origin, callback): void {
    callback(null, true)
  },
  methods: 'GET'
}
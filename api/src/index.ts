import express from 'express'
import logger from './logger/logger'
import health from './routes/health'
import gameplay from './routes/gameplay'
import config from './config/config'
import http from 'http'

const NAMESPACE = 'Server'
const app = express()
app.use([express.urlencoded({ extended: false }), express.json()])

// Request logger
app.use((req, res, next) => {
  logger.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  )
  res.on('finish', () => {
    logger.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    )
  })
  next()
})

app.use('/health', health)

app.use('/gameplay', gameplay)

// Catch undefined endpoints
app.use((req, res, next) => {
  const error = new Error('Error 404: Resource not found')
  return res.status(404).json({ message: error.message })
})

const httpServer = http.createServer(app)
httpServer.listen(config.server.port, () =>
  logger.info(
    NAMESPACE,
    `Server is running on ${config.server.hostname}:${config.server.port}`
  )
)

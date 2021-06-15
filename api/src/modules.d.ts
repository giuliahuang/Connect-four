declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_HOSTNAME: string
    SERVER_PORT: string
    REDIS_PORT: string
    JWT_SECRET: string
    MONGO_CONNECTION_STRING: string
  }
}
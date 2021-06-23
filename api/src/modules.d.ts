/**
 * This types definition is needed so that Node won't complain about
 * checking whether the variables exist in the process.env
 * This just disables the lint error, actual verification
 * is needed and provided by envalid in the setupEnv module
 */
declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_HOSTNAME: string
    SERVER_PORT: string
    REDIS_PORT: string
    JWT_SECRET: string
    MONGO_CONNECTION_STRING: string
  }
}
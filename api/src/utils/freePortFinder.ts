import portFinder from 'portfinder'

export default async function freePortFinder(): Promise<number | void> {
  try {
    const port = await portFinder.getPortPromise()
    return port
  } catch (err) {
    return err
  }
}
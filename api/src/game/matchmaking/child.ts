const MAX_TIME_IN_QUEUE = 20000
const POOL_POLL_INTERVAL = 1000
const mm_pool = new Map<string, any>()

setInterval(() => matchmake(mm_pool), POOL_POLL_INTERVAL)

// Ideally this should be implemented through a microservice instead of a child process
process.on('message', (message) => {
  const player = {
    id: message.id,
    mmr: message.mmr,
    ws: message.ws,
    timeJoined: Date.now()
  }
  if (!mm_pool.has(player.id))
    mm_pool.set(player.id, player)
})

/**
 * Iterates through the pool until all players have been matched, then it returns
 * @param mm_pool Matchmaking map
 */
function matchmake(mm_pool: Map<string, any>) {
  if (mm_pool.size < 1) return

  //enabled down level iteration, look for better alternative
  for (const [A, p1] of mm_pool) {
    for (const [B, p2] of mm_pool) {
      if (isMatch(p1, p2)) {
        const a = mm_pool.get(A)
        const b = mm_pool.get(B)
        if (a && b) {
          mm_pool.delete(A)
          mm_pool.delete(B)
          process.send!({ player1: { ...a }, player2: { ...b } })
          // process.exit()
        }
      }
    }
  }
}

/**
 * Checks whether the users provided are a good match. The condition gets
 * looser the longer player 1 has been in queue.
 * The maximum difference in MMR is 500
 * @param p1 player 1
 * @param p2 player 2
 * @returns true if the two player have been matched, false otherwise
 */
function isMatch(p1: any, p2: any): boolean {
  if (p1 !== p2 && Math.abs(p1.mmr - p2.mmr) < 500)
    if (Math.abs(p1.mmr - p2.mmr) < (10 * p1.timeJoined * 1000))
      return true
  return false
}
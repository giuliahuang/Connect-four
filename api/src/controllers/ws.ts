export function ws1(req, res) {
  return res.sendFile('/workspace/api/public/player1.html')
}

export function ws2(req, res) {
  return res.sendFile('/workspace/api/public/player2.html')
}
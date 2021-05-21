import { Player } from './Player'
import { Logger } from 'tslog'

const logger = new Logger()
const rows = 6
const columns = 7

export class Match {
  public readonly player1: Player
  public readonly player2: Player
  public readonly game_board = Array.from(Array(rows), _ => Array(columns).fill(0))
  private heights = Array(columns).fill(0) //height of columns
  private p1Turn = true

  constructor(player1: Player, player2: Player) {
    this.player1 = player1
    this.player2 = player2
  }

  private isWinner(col: number): boolean {
    if (this.heights[col] == 0) {
      logger.error("ERROR: Empty columns\n")
      return false
    }

    const player = this.game_board[this.heights[col] - 1][col]

    //vertical alignment
    if (this.heights[col] > 3
      && this.game_board[this.heights[col] - 2][col] == player
      && this.game_board[this.heights[col] - 3][col] == player
      && this.game_board[this.heights[col] - 4][col] == player) {
      return true
    }

    //dx = -1 -> diagonal alignment /
    //dx = 0  -> horizontal alignment --
    //dx = 1  -> diagonal alignment \
    for (let dx = -1; dx <= 1; dx++) {
      let nb = 0
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let x = this.heights[col] - 1 + dx * dy, y = col + dy; x >= 0 && x < rows && y >= 0 && y < columns && this.game_board[x][y] == player; nb++) {
          x += dx * dy
          y += dy
        }
        if (nb >= 3) {
          return true
        }
      }
    }
    return false
  }

  public colIsFull(col: number): boolean {
    return (this.heights[col] == rows)
  }

  public addDot(col: number, player: Player): boolean {
    if ((this.p1Turn && player === this.player1) || (!this.p1Turn && player === this.player2)) {
      this.game_board[this.heights[col]][col] = player.id
      this.heights[col]++
      this.p1Turn = !this.p1Turn
      return this.isWinner(col)
    }
    return false
  }
}
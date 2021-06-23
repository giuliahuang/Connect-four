import logger from '../../logger'
import MatchResults from '../../models/MatchResults'
import { endMatch } from '../../mongo/matchMethods'
import Player from '../Player'
import MoveResult from './MoveResult'
import { v4 as uuidv4 } from 'uuid'

export class Match {
  public readonly player1: Player
  public readonly player2: Player
  public readonly uuid = uuidv4()
  private readonly rows = 6
  private readonly columns = 7
  public readonly game_board = Array.from(Array(this.rows), () => Array(this.columns).fill(0))
  private heights = Array(this.columns).fill(0) //height of columns
  private p1Turn = true

  constructor(player1: Player, player2: Player) {
    this.player1 = player1
    this.player2 = player2
  }

  /**
   * 
   * @param col indicates which column the user added a dot to
   * @returns true if the move was a winning move, false otherwise
   */
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
        for (let x = this.heights[col] - 1 + dx * dy, y = col + dy; x >= 0 &&
          x < this.rows && y >= 0 &&
          y < this.columns && this.game_board[x][y] == player; nb++) {

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
    return (this.heights[col] == this.rows)
  }

  /**
   * Received the move from a player, checks if the user is authorized to play and if it's that user's turn
   * If the move is verified and accepted it calls isWinner to check if it's a winning move
   * @param col Column number where the user inserted the dot
   * @param playerId ID of the player who played the turn
   * @returns a MoveResult object that specifies whether the move has been accepted and whether the move
   * was a winning move through matchResult. If the property is set it contains the IDs of the winner and the loser
   */
  public addDot(col: number, playerId: string): MoveResult {
    const res: MoveResult = {
      accepted: false,
      matchResult: undefined
    }
    let player: Player
    
    if (this.player1.id.toString() === playerId.toString()) player = this.player1
    else if (this.player2.id.toString() === playerId.toString()) player = this.player2
    else return res


    if ((this.p1Turn && player === this.player1) || (!this.p1Turn && player === this.player2)) {
      this.game_board[this.heights[col]][col] = player.id
      this.heights[col]++
      res.accepted = true

      if (this.isWinner(col)) {
        let loser: Player
        if (player === this.player1) loser = this.player2
        else loser = this.player1
        res.matchResult = {
          winner: player.username,
          loser: loser.username
        }
        this.endGame(res.matchResult)
      }
      this.p1Turn = !this.p1Turn
    }
    return res
  }

  private endGame(res: MatchResults) {
    endMatch(res)
  }
}
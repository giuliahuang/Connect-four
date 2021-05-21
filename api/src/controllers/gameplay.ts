import { Request, Response, NextFunction } from 'express'
import logger from '../logger/logger'

const NAMESPACE = 'Sample Controller'

const gameplayCheck = (req: Request, res: Response, next: NextFunction) => {
  logger.info(NAMESPACE, 'Gameplay check route')
  return res.status(200).json({ message: 'GAMEPLAY PAGE' })
}

class GameBoard {

    private row = 6;
    private column = 7;
    private game_board:number[][];
    private heights:number[]; //heights of columns

    constructor(){
        this.game_board = Array.from(Array(this.row), _ => Array(this.column).fill(0));
        this.heights = Array(this.column).fill(0);
    }

    public is_winner(col:number):boolean{
        if(this.heights[col] == 0){
            process.stdout.write("ERROR: Empty column\n")
            return false;
        }

        var player = this.game_board[this.heights[col]-1][col];

        //vertical alignment
        if(this.heights[col]>3
            &&this.game_board[this.heights[col]-2][col] == player
            &&this.game_board[this.heights[col]-3][col] == player
            &&this.game_board[this.heights[col]-4][col] == player){
                return true;
        }

        //dx = -1 -> diagonal alignment /
        //dx = 0  -> horizontal alignment --
        //dx = 1  -> diagonal alignment \
        for(var dx=-1; dx<=1; dx++){
            var nb = 0;
            for(var dy=-1; dy<=1; dy+=2){
                for(var x = this.heights[col]-1+dx*dy, y=col+dy; x>=0 && x<this.row&&y>=0&& y<this.column &&this.game_board[x][y]==player;nb++){
                    x += dx*dy;
                    y += dy;
                }
                if(nb>=3){
                    return true;
                }
            }
        }
        return false;
    }

    public col_is_full(col:number):boolean{
        return (this.heights[col]==this.row);
    }

    public add_dot(col:number,player:number){
        this.game_board[this.heights[col]][col]=player;
        this.heights[col]++;
    }

    public print_matrix(){
        for(var i:number = 0; i<this.row; i++){
            for(var j:number=0; j<this.column; j++){
                process.stdout.write("" + this.game_board[i][j] + " ");
            }
            process.stdout.write("\n");
        }
        process.stdout.write("\n");
    }
}

export class Game{

    private player1;
    private player2;
    private board:GameBoard;
    

    constructor(player1:number,player2:number){
        this.board = new GameBoard;
        this.player1 = player1;
        this.player2 = player2;
        var win = false;
    }

}

var game = new GameBoard;

game.add_dot(0,1);
game.add_dot(1,2);
game.add_dot(1,1);
game.add_dot(2,2);
game.add_dot(2,2);
game.add_dot(3,2);
game.add_dot(3,2);
game.add_dot(3,2);
game.add_dot(3,1);
game.add_dot(2,1);
game.add_dot(3,1);
game.add_dot(3,1);

game.add_dot(4,2);

game.print_matrix();

process.stdout.write(""+game.is_winner(5));


process.stdout.write("FULL: "+game.col_is_full(2));
process.stdout.write("FULL: "+game.col_is_full(3));

export default { gameplayCheck }

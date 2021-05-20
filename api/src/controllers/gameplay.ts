import { Request, Response, NextFunction } from 'express'
import logger from '../logger/logger'

const NAMESPACE = 'Sample Controller'

const gameplayCheck = (req: Request, res: Response, next: NextFunction) => {
  logger.info(NAMESPACE, 'Gameplay check route')
  return res.status(200).json({ message: 'GAMEPLAY PAGE' })
}




class GamePlay {
    private game_board:number[][];

    constructor(){
        this.game_board = [];

        for(var i:number=0; i<3; i++){

            this.game_board[i] = []
            for(var j:number=0;j<13;j++)
            this.game_board[i][j]=-9;
        }

        for(var i: number = 3; i<9; i++){
            this.game_board[i] = []
            for(var j: number = 0; j<3; j++){
                this.game_board[i][j] = -9;
            }

            for(var j: number = 3; j<10; j++){
                this.game_board[i][j] = -5;
            }

            for(var j: number = 10; j<13; j++){
                this.game_board[i][j] = -9;
            }
        }

        for(var i:number=9; i<12; i++){

            this.game_board[i] = []
            for(var j:number=0;j<13;j++)
            this.game_board[i][j]=-9;
        }
    }

    public is_empty(r:number,c:number):boolean{
        return this.game_board[r+3][c+3]==0 ? true : false;
    }

    private is_winner(m:number[][],n:number):boolean{
        var counter = 0;
        for(var i:number=0; i<4;i++){
            for(var j:number=0; j<7;j++){
                if(m[i][j]!=n){
                    counter=0;
                }
                else{
                    counter++;
                    process.stdout.write("COUNTER: "+ counter + "\n");
                }
                if(counter==4){
                    return true;
                }
            }
            counter=0;
        }
        return false;
    }

    //input: color, column
    //output: row
    public add_dot(color:number,col:number):boolean{
        if(!this.col_is_full(col)){
            for(var i:number = 5; i>=0; i--){
                if(this.game_board[i+3][col+3]==-5){
                    this.game_board[i+3][col+3]=color;

                    process.stdout.write("The player " + color + " added on (" + i + "," + col + ")!\n");
                    var m:number[][] = this.find_matrix(i,col);
                    this.print_matrix(m,4,7);
                    if(this.is_winner(m,color)){
                        process.stdout.write("The player " + color + " won the match !!\n")
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public print_board(){
        for(var i:number = 0; i<12; i++){
            for(var j:number=0; j<13; j++){
                process.stdout.write("" + this.game_board[i][j] + " ");
            }
            process.stdout.write("\n");
        }
        process.stdout.write("\n");
        
    }

    public print_matrix(m:number[][],row:number,col:number){
        for(var i:number = 0; i<row; i++){
            for(var j:number=0; j<col; j++){
                process.stdout.write("" + m[i][j] + " ");
            }
            process.stdout.write("\n");
        }
        process.stdout.write("\n");
    }

    private find_matrix(row:number,col:number):number[][]{
        //row1: horizontal
        //row2: vertical
        //row3: diagonal(left-right)
        //row4: diagonal(right-left)
        var m:number[][];
        m = [];
        var real_col = col+3;
        var real_row = row+3;
        var j = 0;
        var k = 0;

        for(var i:number=0;i<4;i++){
            m[i]=[];
        }

        //row1
        for(var i:number = real_col-3; i<=real_col+3;i++){
            m[j][k++]=this.game_board[real_row][i];
        }
        j++;
        k=0;
        //row2
        for(var i:number = real_row-3; i<=real_row+3;i++){
            m[j][k++]=this.game_board[i][real_col];
        }
        j++;
        k=0;
        //row3
        var i = real_row-3;
        var u = real_col-3;
        while(i<=real_row+3){
            m[j][k++]=this.game_board[i++][u++];
        }
        j++;
        k=0;
        //row4
        var i = real_row-3;
        var u = real_col+3;
        while(i<=real_row+3){
            m[j][k++]=this.game_board[i++][u--];
        }
        return m;
    }

    public col_is_full(col:number):boolean{
        var real_col = col+3;
        if(this.game_board[3][real_col]!=-5){
            return true;
        }
        return false;
    }

}


var game = new GamePlay;

game.print_board();

game.add_dot(1,3);

game.add_dot(2,4);

game.add_dot(1,3);

game.add_dot(1,3);
game.add_dot(1,3);

game.print_board();

export default { gameplayCheck }

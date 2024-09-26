const { GameBoard } = require("./gameboard");

export class Player {
  #gameBoard;

  constructor() {
    this.#gameBoard = new GameBoard();
  }

  get gameBoard() {
    return this.#gameBoard;
  }

  makeComputerMove(opponentGameBoard) {
    let legalMoveMade = false;

    while (!legalMoveMade) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);

      if (!opponentGameBoard.positionIsHit([y, x])) {
        opponentGameBoard.receiveAttack([y, x]);
        legalMoveMade = true;
      }
    }
  }
}

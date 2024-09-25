const { GameBoard } = require("./gameboard");

class Player {
  #gameBoard;
  #isComputer;

  constructor(isComputer = false) {
    this.#gameBoard = new GameBoard();
    this.#isComputer = isComputer;
  }

  get gameBoard() {
    return this.#gameBoard;
  }
}

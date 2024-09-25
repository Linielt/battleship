const { GameBoard } = require("./gameboard");

class Player {
  #gameboard;
  #isComputer;

  constructor(isComputer = false) {
    this.#gameboard = new GameBoard();
    this.#isComputer = isComputer;
  }
}

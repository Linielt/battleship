import { Ship } from "./ship";

export class GameBoard {
  #grid;
  #attackedGrid;
  #ships;

  constructor() {
    this.#grid = new Array(10);
    this.#attackedGrid = new Array(10);
    for (let i = 0; i < this.#grid.length; i++) {
      this.#grid[i] = new Array(10).fill(null);
      this.#attackedGrid[i] = new Array(10).fill(false);
    }
    this.#ships = [];
  }

  placeShip(startPos, endPos) {
    if (!this.isOnBoard(startPos) || !this.isOnBoard(endPos)) {
      return false;
    }

    let shipLength = this.calculateShipLength(startPos, endPos);

    if (shipLength === false) {
      throw new Error("Invalid start and end positions for ship.");
    }

    let ship = new Ship(shipLength);

    for (
      let i = Math.min(startPos[0], endPos[0]);
      i <= Math.max(startPos[0], endPos[0]);
      i++
    ) {
      for (
        let j = Math.min(startPos[1], endPos[1]);
        j <= Math.max(startPos[1], endPos[1]);
        j++
      ) {
        this.#grid[i][j] = ship;
      }
    }

    this.#ships.push(ship);
    return true;
  }

  calculateShipLength(startPos, endPos) {
    let shipLength = 0;
    if (startPos[0] === endPos[0]) {
      shipLength = Math.abs(endPos[1] - startPos[1]) + 1;
    } else if (startPos[1] === endPos[1]) {
      shipLength = Math.abs(endPos[0] - startPos[0]) + 1;
    }

    if (shipLength === 0) {
      return false;
    }

    return shipLength;
  }

  isPlaceable(startPos, endPos) {
    if (!this.isOnBoard(startPos) || !this.isOnBoard(endPos)) {
      return false;
    }
    if (this.isShipWithinRange(startPos, endPos)) {
      return false;
    }

    return true;
  }

  isOnBoard(position) {
    if (
      position[0] < 0 ||
      position[1] < 0 ||
      position[0] >= 10 ||
      position[1] >= 10
    ) {
      return false;
    }

    return true;
  }

  isShipAtPosition(position) {
    if (this.#grid[position[0]][position[1]] instanceof Ship) {
      return true;
    }

    return false;
  }

  isShipWithinRange(startPos, endPos) {
    for (
      let i = Math.min(startPos[0], endPos[0]);
      i <= Math.max(startPos[0], endPos[0]);
      i++
    ) {
      for (
        let j = Math.min(startPos[1], endPos[1]);
        j <= Math.max(startPos[1], endPos[1]);
        j++
      ) {
        if (this.#grid[i][j] instanceof Ship) {
          return true;
        }
      }
    }

    return false;
  }

  receiveAttack(position) {
    if (this.positionIsHit(position)) {
      return false;
    }
    if (this.isShipAtPosition(position)) {
      this.#grid[position[0]][position[1]].hit();
    }

    this.#attackedGrid[position[0]][position[1]] = true;
    return true;
  }

  positionIsHit(position) {
    if (this.#attackedGrid[position[0]][position[1]]) {
      return true;
    }

    return false;
  }

  areAllShipsSunk() {
    for (let ship of this.#ships) {
      if (ship.isSunk() === false) {
        return false;
      }
    }

    return true;
  }

  reset() {
    for (let i = 0; i < this.#grid.length; i++) {
      this.#grid[i] = new Array(10).fill(null);
      this.#attackedGrid[i] = new Array(10).fill(false);
    }
    this.#ships = [];
  }
}

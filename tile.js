export class Tile {
  #beenAttacked;
  #ship;

  constructor() {
    this.#beenAttacked = false;
    this.#ship = null;
  }

  assignShip(ship) {
    this.#ship = ship;
  }

  hit() {
    if (this.#beenAttacked === false) {
      this.#beenAttacked = true;
      if (this.#ship !== null) {
        this.#ship.hit();
      }
    }
  }
}

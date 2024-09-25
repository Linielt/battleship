export class Ship {
  #length;
  #timesHit;

  constructor(length) {
    this.#length = length;
    this.#timesHit = 0;
  }

  get length() {
    return this.#length;
  }

  get timesHit() {
    return this.#timesHit;
  }

  hit() {
    if (this.#timesHit !== this.#length) {
      this.#timesHit++;
      this.isSunk();
    } else {
      throw new Error("Ship is sunk.");
    }
  }
  isSunk() {
    if (this.#timesHit === this.#length) {
      return true;
    }

    return false;
  }
}

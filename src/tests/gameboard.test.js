import { GameBoard } from "../gameboard";

describe("Test GameBoard object", () => {
  const testGameBoard = new GameBoard();

  test("Placing ship", () => {
    testGameBoard.placeShip([0, 0], [0, 3]);

    expect(testGameBoard.isShipAtPosition([0, 0])).toBeTruthy();
    expect(testGameBoard.isShipAtPosition([0, 1])).toBeTruthy();
    expect(testGameBoard.isShipAtPosition([0, 2])).toBeTruthy();
    expect(testGameBoard.isShipAtPosition([0, 3])).toBeTruthy();
    expect(testGameBoard.isShipAtPosition([0, 4])).toBeFalsy();
    expect(testGameBoard.isShipWithinRange([0, 0], [0, 3]));
  });

  test("Attacking on gameboard", () => {
    expect(testGameBoard.positionIsHit([0, 0])).toBeFalsy();
    testGameBoard.receiveAttack([0, 0]);
    expect(testGameBoard.positionIsHit([0, 0])).toBeTruthy();
  });

  test("Sinking a ship", () => {
    expect(testGameBoard.areAllShipsSunk()).toBeFalsy();
    testGameBoard.receiveAttack([0, 1]);
    testGameBoard.receiveAttack([0, 2]);
    testGameBoard.receiveAttack([0, 3]);
    expect(testGameBoard.areAllShipsSunk()).toBeTruthy();
  });

  test("Attacking invalid coordinates", () => {
    expect(testGameBoard.isOnBoard([-45, 64])).toBeFalsy();
    expect(testGameBoard.isOnBoard([65, -45])).toBeFalsy();
  });

  test("Reset board", () => {
    testGameBoard.reset();
    expect(testGameBoard.isShipWithinRange([0, 0], [9, 9])).toBeFalsy();
  });
});

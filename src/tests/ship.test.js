import { Ship } from "../ship";

it("Test Ship object", () => {
  const ship = new Ship(3);

  expect(ship.timesHit).toEqual(0);
  expect(ship.isSunk()).toBeFalsy();

  ship.hit();
  ship.hit();
  ship.hit();

  expect(ship.timesHit).toEqual(3);
  expect(ship.isSunk()).toBeTruthy();

  expect(() => ship.hit()).toThrow();
});

import { displayEnemyGameBoard, displayGameBoard } from "./gameboard-dom";
import { Player } from "./player";
import "./styles.css";

const playerOneTable = document.getElementById("player-1-table");
const playerTwoTable = document.getElementById("player-2-table");

let playerOne = new Player();
let playerTwo = new Player();

playerOne.gameBoard.placeShip([0, 0], [0, 3]);
playerOne.gameBoard.receiveAttack([0, 0]);
playerOne.gameBoard.receiveAttack([0, 1]);
playerOne.gameBoard.receiveAttack([0, 2]);

playerOne.gameBoard.receiveAttack([3, 3]);

playerTwo.gameBoard.placeShip([9, 6], [9, 9]);
playerTwo.gameBoard.receiveAttack([9, 6]);
playerTwo.gameBoard.receiveAttack([9, 7]);
playerTwo.gameBoard.receiveAttack([9, 8]);
playerTwo.gameBoard.receiveAttack([9, 9]);

playerTwo.gameBoard.receiveAttack([0, 3]);

displayGameBoard(playerOneTable, playerOne.gameBoard);
displayEnemyGameBoard(playerTwoTable, playerTwo.gameBoard);

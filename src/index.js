import { Player } from "./player";
import { Ship } from "./ship";
import { Gamemodes } from "./gamemode";
import "./styles.css";

const playerOneTable = document.getElementById("player-one-table");
const playerTwoTable = document.getElementById("player-two-table");

let playerOne = new Player();
let playerTwo = new Player();
let prevPlayer = playerTwo;
let gamemode = Gamemodes.SINGLEPLAYER;
let isGameOver = false;

const renderGameBoard = (table, gameboard) => {
  const gameBoardGrid = gameboard.grid;
  const gameBoardAttackedGrid = gameboard.attackedGrid;

  table.innerHTML = "";

  for (let y = 0; y < gameBoardGrid.length; y++) {
    let gameBoardRow = document.createElement("tr");
    gameBoardRow.className = "battleship-row";
    gameBoardRow.id = `battleship-row-${y}`;
    for (let x = 0; x < gameBoardGrid[y].length; x++) {
      const gameBoardCell = document.createElement("td");
      gameBoardCell.className = "battleship-cell";
      gameBoardCell.setAttribute("data-x", String(x));
      gameBoardCell.setAttribute("data-y", String(y));
      const gameBoardCellContent = document.createElement("div");
      gameBoardCellContent.className = "battleship-cell-content";

      let isShip = gameBoardGrid[y][x] instanceof Ship;
      let isSunk = false;

      if (isShip) {
        isSunk = gameBoardGrid[y][x].isSunk();
      }
      if (isSunk) {
        gameBoardCell.classList.toggle("sunk");
      }
      if (isShip && gameBoardAttackedGrid[y][x]) {
        gameBoardCellContent.classList.toggle("attacked");
        gameBoardCell.classList.toggle("not-sunk");
      }
      if (!isShip && gameBoardAttackedGrid[y][x]) {
        gameBoardCellContent.classList.toggle("attacked");
      }
      if (!isSunk && isShip) {
        gameBoardCell.classList.toggle("ship");
      }

      gameBoardCell.appendChild(gameBoardCellContent);
      gameBoardRow.appendChild(gameBoardCell);
    }
    table.appendChild(gameBoardRow);
  }
};

const renderOpponentGameBoard = (table, gameboard) => {
  const gameBoardGrid = gameboard.grid;
  const gameBoardAttackedGrid = gameboard.attackedGrid;

  table.innerHTML = "";

  for (let y = 0; y < gameBoardGrid.length; y++) {
    let gameBoardRow = document.createElement("tr");
    gameBoardRow.className = "battleship-row";
    gameBoardRow.id = `battleship-row-${y}`;
    for (let x = 0; x < gameBoardGrid[y].length; x++) {
      const gameBoardCell = document.createElement("td");
      gameBoardCell.className = "battleship-cell";
      gameBoardCell.setAttribute("data-x", String(x));
      gameBoardCell.setAttribute("data-y", String(y));
      const gameBoardCellContent = document.createElement("div");
      gameBoardCellContent.className = "battleship-cell-content";

      let isShip = gameBoardGrid[y][x] instanceof Ship;
      let isSunk = false;

      if (isShip) {
        isSunk = gameBoardGrid[y][x].isSunk();
      }
      if (isSunk) {
        gameBoardCell.classList.toggle("sunk");
      }
      if (isShip && gameBoardAttackedGrid[y][x]) {
        gameBoardCellContent.classList.toggle("attacked");
        gameBoardCell.classList.toggle("not-sunk");
      }
      if (!isShip && gameBoardAttackedGrid[y][x]) {
        gameBoardCellContent.classList.toggle("attacked");
      }

      gameBoardCell.appendChild(gameBoardCellContent);
      gameBoardRow.appendChild(gameBoardCell);

      if (!gameBoardAttackedGrid[y][x]) {
        gameBoardCell.addEventListener("click", () => {
          gameboard.receiveAttack([y, x]);

          if (prevPlayer === playerTwo) {
            if (gamemode === Gamemodes.SINGLEPLAYER) {
              setTimeout(() => {
                playerTwo.makeComputerMove(playerOne.gameBoard);
                renderGameBoard(playerOneTable, playerOne.gameBoard);
                renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
              }, 500);
            } else if (gamemode === Gamemodes.MULTIPLAYER) {
              setTimeout(() => {
                prevPlayer = playerOne; // TODO - Add delay when switching displays or add warning before this triggers
                renderGameBoard(playerTwoTable, playerTwo.gameBoard);
                renderOpponentGameBoard(playerOneTable, playerOne.gameBoard);
              }, 500);
            }
          } else if (prevPlayer === playerOne) {
            if (gamemode === Gamemodes.MULTIPLAYER) {
              setTimeout(() => {
                prevPlayer = playerTwo;
                renderGameBoard(playerOneTable, playerOne.gameBoard);
                renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
              }, 500);
            }
          }
        });
      }
    }
    table.appendChild(gameBoardRow);
  }
};

renderGameBoard(playerOneTable, playerOne.gameBoard);
renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);

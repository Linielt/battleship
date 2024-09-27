import { Player } from "./player";
import { Ship } from "./ship";
import { Gamemodes } from "./gamemode";
import "./styles.css";

const gamemodeForm = document.getElementById("gamemode-selection-form");
const gameOverDialog = document.getElementById("gameover-dialog");
const newGameButton = document.getElementById("new-game-button");
const winnerText = document.getElementById("winner-text");
const playerOneTable = document.getElementById("player-one-table");
const playerTwoTable = document.getElementById("player-two-table");
const shipLengths = [5, 4, 3, 3, 2];

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
          checkGameState();

          if (prevPlayer === playerTwo && !isGameOver) {
            if (gamemode === Gamemodes.SINGLEPLAYER) {
              renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard); // Render attack made from human to computer first

              setTimeout(() => {
                playerTwo.makeComputerMove(playerOne.gameBoard); // Make this be better or something or change the timing
                renderGameBoard(playerOneTable, playerOne.gameBoard);
                checkGameState();
              }, 500);
            } else if (gamemode === Gamemodes.MULTIPLAYER) {
              prevPlayer = playerOne; // TODO - Add delay when switching displays or add warning before this triggers
              renderGameBoard(playerTwoTable, playerTwo.gameBoard);
              renderOpponentGameBoard(playerOneTable, playerOne.gameBoard);
            }
          } else if (prevPlayer === playerOne && !isGameOver) {
            if (gamemode === Gamemodes.MULTIPLAYER) {
              prevPlayer = playerTwo;
              renderGameBoard(playerOneTable, playerOne.gameBoard);
              renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
            }
          }
        });
      }
    }
    table.appendChild(gameBoardRow);
  }
};

const checkGameState = () => {
  if (playerOne.gameBoard.areAllShipsSunk()) {
    winnerText.innerHTML = "Player Two wins!";
    gameOverDialog.showModal();
    isGameOver = true;
  } else if (playerTwo.gameBoard.areAllShipsSunk()) {
    winnerText.innerHTML = "Player One wins!";
    gameOverDialog.showModal();
    isGameOver = true;
  } else {
    return;
  }

  if (isGameOver) {
    renderGameBoard(playerOneTable, playerOne.gameBoard);
    renderGameBoard(playerTwoTable, playerTwo.gameBoard);
  }
};

const placeShipsRandomly = (gameboard) => {
  for (let length of shipLengths) {
    let shipPlaced = false;
    while (!shipPlaced) {
      let randomX = Math.floor(Math.random() * 10);
      let randomY = Math.floor(Math.random() * 10);

      let isHorizontal = Math.random() < 0.5;

      if (isHorizontal) {
        shipPlaced = gameboard.placeShip(
          [randomY, randomX],
          [randomY, randomX - length + 1]
        );
      } else if (!isHorizontal) {
        shipPlaced = gameboard.placeShip(
          [randomY, randomX],
          [randomY - length + 1, randomX]
        );
      }
    }
  }
};

// const selectGamemode = () => {
//   const gamemodeForm = document.getElementById("gamemode-selection-form");
// };

const resetGame = () => {
  playerOne = new Player();
  playerTwo = new Player();
  isGameOver = false;
  prevPlayer = playerTwo;
  placeShipsRandomly(playerOne.gameBoard);
  placeShipsRandomly(playerTwo.gameBoard);
  renderGameBoard(playerOneTable, playerOne.gameBoard);
  renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
};

gamemodeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let selectedGamemode = document.querySelector(
    'input[name="gamemode"]:checked'
  ).value;
  gamemodeForm.style.display = "none";
  // Hide form
  // Display pre game placement dependant on gamemode selected and make the logic for that
  // Before this though, settle the placing ships thing first
  if (selectedGamemode === "singleplayer") {
    gamemode = Gamemodes.SINGLEPLAYER;
    resetGame();
  } else if (selectedGamemode === "multiplayer") {
    gamemode = Gamemodes.MULTIPLAYER;
    resetGame(); // Make changes to this later
  }

  document.getElementById("battleship-pre-game-container").style.display =
    "none";
  document.getElementById("battleship-main-game-container").style.display =
    "inline-block";
});

newGameButton.addEventListener("click", () => {
  gameOverDialog.close();
  gamemodeForm.style.display = "block";
  document.getElementById("battleship-pre-game-container").style.display =
    "block";
  document.getElementById("battleship-main-game-container").style.display =
    "none";
});

// Testing code
// playerOne.gameBoard.placeShip([0, 0], [0, 3]);
// playerTwo.gameBoard.placeShip([9, 6], [9, 9]);
// placeShipsRandomly(playerOne.gameBoard); // Move these to condition based code based on gamemode selected and buttons and such
// placeShipsRandomly(playerTwo.gameBoard);
// renderGameBoard(playerOneTable, playerOne.gameBoard);
// renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);

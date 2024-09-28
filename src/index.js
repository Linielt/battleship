import { Player } from "./player";
import { Ship } from "./ship";
import { Gamemodes } from "./gamemode";
import "./styles.css";
import { GameBoard } from "./gameboard";

const gamemodeForm = document.getElementById("gamemode-selection-form");
const shipPlacementContainer = document.getElementById(
  "ship-placement-container"
);
const preGameShipPlacementTable = document.getElementById(
  "pre-game-ship-placement-table"
);
// const rotateButton = document.getElementById("rotate-ship-button");
const currentStatus = document.getElementById("current-status");
const gameOverDialog = document.getElementById("gameover-dialog");
const newGameButton = document.getElementById("new-game-button");
const winnerText = document.getElementById("winner-text");
const playerOneTable = document.getElementById("player-one-table");
const playerTwoTable = document.getElementById("player-two-table");
const shipLengths = [5, 4, 3, 3, 2];

let playerOne = new Player();
let playerTwo = new Player();
let currentPlayer = playerOne;
let gamemode = Gamemodes.SINGLEPLAYER;
let isGameOver = false;
let indexOfShipToBePlaced = 0;
let orientation = "h";

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

const renderShipPlacementButtons = (table, gameboard) => {
  const shipPlacementButtonsContainer = document.getElementById(
    "ship-placement-buttons-container"
  );

  shipPlacementButtonsContainer.innerHTML = "";

  const rotateButton = document.createElement("button");
  rotateButton.className = "ship-placement-button";
  rotateButton.id = "rotate-ship-button";
  rotateButton.innerHTML = "Rotate";

  rotateButton.addEventListener("click", () => {
    if (orientation === "h") {
      orientation = "v";
    } else if (orientation === "v") {
      orientation = "h";
    }
    renderShipPlacementGameBoard(table, gameboard);
  });

  const randomizeButton = document.createElement("button");
  rotateButton.className = "ship-placement-button";
  randomizeButton.id = "randomize-ships-button";
  randomizeButton.innerHTML = "Randomize";

  randomizeButton.addEventListener("click", () => {
    placeShipsRandomly(gameboard);
    indexOfShipToBePlaced = shipLengths.length;
    renderShipPlacementGameBoard(table, gameboard);
  });

  const restartButton = document.createElement("button");
  restartButton.className = "ship-placement-button";
  restartButton.id = "restart-ship-placement-button";
  restartButton.innerHTML = "Restart";

  restartButton.addEventListener("click", () => {
    gameboard.reset();
    indexOfShipToBePlaced = 0;
    renderShipPlacementGameBoard(table, gameboard);
  });

  const completeShipPlacementButton = document.createElement("button");
  completeShipPlacementButton.className = "ship-placement-button";
  completeShipPlacementButton.id = "completed-ship-placement-button";
  completeShipPlacementButton.innerHTML = "Done";

  completeShipPlacementButton.addEventListener("click", () => {
    if (indexOfShipToBePlaced === shipLengths.length) {
      indexOfShipToBePlaced = 0;

      if (currentPlayer === playerOne && gamemode === Gamemodes.SINGLEPLAYER) {
        placeShipsRandomly(playerTwo.gameBoard);
        renderGameBoard(playerOneTable, playerOne.gameBoard);
        renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
        currentStatus.innerHTML = "Player One's turn";
        document.getElementById("battleship-pre-game-container").style.display =
          "none";
        document.getElementById(
          "battleship-main-game-container"
        ).style.display = "inline-block";
      }
      if (currentPlayer === playerOne && gamemode === Gamemodes.MULTIPLAYER) {
        renderShipPlacementGameBoard(
          preGameShipPlacementTable,
          playerTwo.gameBoard
        );
        currentPlayer = playerTwo;
        currentStatus.innerHTML = "Player Two Ship Placement";
      } else if (
        currentPlayer === playerTwo &&
        gamemode === Gamemodes.MULTIPLAYER
      ) {
        renderGameBoard(playerOneTable, playerOne.gameBoard);
        renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
        currentStatus.innerHTML = "Player One's turn";
        currentPlayer = playerOne;
        document.getElementById("battleship-pre-game-container").style.display =
          "none";
        document.getElementById(
          "battleship-main-game-container"
        ).style.display = "inline-block";
      }
    }
  });

  shipPlacementButtonsContainer.appendChild(rotateButton);
  shipPlacementButtonsContainer.appendChild(randomizeButton);
  shipPlacementButtonsContainer.appendChild(restartButton);
  shipPlacementButtonsContainer.appendChild(completeShipPlacementButton);
};

const renderShipPlacementGameBoard = (table, gameboard) => {
  const gameBoardGrid = gameboard.grid;

  table.innerHTML = "";

  for (let y = 0; y < gameBoardGrid.length; y++) {
    let gameBoardRow = document.createElement("tr");
    gameBoardRow.className = "battleship-row";
    gameBoardRow.id = `battleship-row-${y}`;
    for (let x = 0; x < gameBoardGrid[y].length; x++) {
      const gameBoardCell = document.createElement("td");
      gameBoardCell.className = "battleship-cell";
      gameBoardCell.id = `battleship-cell-x-${x}-y-${y}`;
      gameBoardCell.setAttribute("data-x", String(x));
      gameBoardCell.setAttribute("data-y", String(y));
      const gameBoardCellContent = document.createElement("div");
      gameBoardCellContent.className = "battleship-cell-content";

      let isShip = gameBoardGrid[y][x] instanceof Ship;

      if (isShip) {
        gameBoardCell.classList.toggle("ship");
      }

      if (indexOfShipToBePlaced < shipLengths.length && !isShip) {
        gameBoardCell.addEventListener("mouseover", () => {
          let shipLength = shipLengths[indexOfShipToBePlaced];
          if (orientation === "h") {
            let shipCanBePlacedHorizontally = gameboard.isPlaceable(
              [y, x],
              [y, x + shipLength - 1]
            );
            if (shipCanBePlacedHorizontally) {
              for (let i = x; i < x + shipLength && i < 10; i++) {
                let cell = document.getElementById(
                  `battleship-cell-x-${i}-y-${y}`
                );
                cell.style.backgroundColor = "#22FF22";
              }
            } else if (!shipCanBePlacedHorizontally) {
              for (let i = x; i < x + shipLength && i < 10; i++) {
                if (gameBoardGrid[y][i] instanceof Ship === false) {
                  let cell = document.getElementById(
                    `battleship-cell-x-${i}-y-${y}`
                  );
                  cell.style.backgroundColor = "#FF2222";
                }
              }
            }
          }
          if (orientation === "v") {
            let shipCanBePlacedVertically = gameboard.isPlaceable(
              [y, x],
              [y + shipLength - 1, x]
            );
            if (shipCanBePlacedVertically) {
              for (let i = y; i < y + shipLength && i < 10; i++) {
                let cell = document.getElementById(
                  `battleship-cell-x-${x}-y-${i}`
                );
                cell.style.backgroundColor = "green";
              }
            } else if (!shipCanBePlacedVertically) {
              for (let i = y; i < y + shipLength && i < 10; i++) {
                if (gameBoardGrid[i][x] instanceof Ship === false) {
                  let cell = document.getElementById(
                    `battleship-cell-x-${x}-y-${i}`
                  );
                  cell.style.backgroundColor = "red";
                }
              }
            }
          }
        });

        gameBoardCell.addEventListener("mouseout", () => {
          let shipLength = shipLengths[indexOfShipToBePlaced];
          if (orientation === "h") {
            for (let i = x; i < x + shipLength && i < 10; i++) {
              if (gameBoardGrid[y][i] instanceof Ship === false) {
                let cell = document.getElementById(
                  `battleship-cell-x-${i}-y-${y}`
                );
                cell.style.backgroundColor = "#1581fc";
              }
            }
          } else if (orientation === "v") {
            for (let i = y; i < y + shipLength && i < 10; i++) {
              if (gameBoardGrid[i][x] instanceof Ship === false) {
                let cell = document.getElementById(
                  `battleship-cell-x-${i}-y-${y}`
                );
                cell.style.backgroundColor = "#1581fc";
              }
            }
          }
        });

        gameBoardCell.addEventListener("click", () => {
          let shipLength = shipLengths[indexOfShipToBePlaced];
          if (orientation === "h") {
            let shipCanBePlacedHorizontally = gameboard.isPlaceable(
              [y, x],
              [y, x + shipLength - 1]
            );
            if (shipCanBePlacedHorizontally) {
              gameboard.placeShip([y, x], [y, x + shipLength - 1]);
              renderShipPlacementGameBoard(
                preGameShipPlacementTable,
                gameboard
              );
              indexOfShipToBePlaced++;
            }
          } else if (orientation === "v") {
            let shipCanBePlacedVertically = gameboard.isPlaceable(
              [y, x],
              [y + shipLength - 1, x]
            );
            if (shipCanBePlacedVertically) {
              gameboard.placeShip([y, x], [y + shipLength - 1, x]);
              renderShipPlacementGameBoard(
                preGameShipPlacementTable,
                gameboard
              );
              indexOfShipToBePlaced++;
            }
          }
        });
      }

      gameBoardCell.appendChild(gameBoardCellContent);
      gameBoardRow.appendChild(gameBoardCell);
    }
    table.appendChild(gameBoardRow);

    renderShipPlacementButtons(table, gameboard);
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

          if (currentPlayer === playerOne && !isGameOver) {
            if (gamemode === Gamemodes.SINGLEPLAYER) {
              renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard); // Render attack made from human to computer first
              currentStatus.innerHTML = "Player Two's turn";
              setTimeout(() => {
                playerTwo.makeComputerMove(playerOne.gameBoard); // Make this be better or something or change the timing
                renderGameBoard(playerOneTable, playerOne.gameBoard);
                currentStatus.innerHTML = "Player One's turn";
                checkGameState();
              }, 500);
            } else if (gamemode === Gamemodes.MULTIPLAYER) {
              currentPlayer = playerTwo; // TODO - Add delay when switching displays or add warning before this triggers
              renderGameBoard(playerTwoTable, playerTwo.gameBoard);
              renderOpponentGameBoard(playerOneTable, playerOne.gameBoard);
              currentStatus.innerHTML = "Player Two's turn";
            }
          } else if (currentPlayer === playerTwo && !isGameOver) {
            if (gamemode === Gamemodes.MULTIPLAYER) {
              currentPlayer = playerOne;
              renderGameBoard(playerOneTable, playerOne.gameBoard);
              renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
              currentStatus.innerHTML = "Player One's turn";
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
  gameboard.reset();
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
  currentPlayer = playerOne;
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
    "inline-block";
  // Make it so the gamemode select is hidden after selection
  // Then dependant on the gamemode, do logic of placing ships on the respective gameboards
  // Start game
  currentStatus.textContent = "Player One Ship Placement";
  gamemodeForm.style.display = "none";
  shipPlacementContainer.style.display = "inline-block";
  renderShipPlacementGameBoard(preGameShipPlacementTable, playerOne.gameBoard);
  // document.getElementById("battleship-main-game-container").style.display =
  //   "inline-block";
});

newGameButton.addEventListener("click", () => {
  gameOverDialog.close();
  gamemodeForm.style.display = "block";
  document.getElementById("battleship-pre-game-container").style.display =
    "block";
  shipPlacementContainer.style.display = "none";
  document.getElementById("battleship-main-game-container").style.display =
    "none";
  currentStatus.innerHTML = "Gamemode Selection";
});

// Testing code
// playerOne.gameBoard.placeShip([0, 0], [0, 3]);
// playerTwo.gameBoard.placeShip([9, 6], [9, 9]);
// placeShipsRandomly(playerOne.gameBoard); // Move these to condition based code based on gamemode selected and buttons and such
// placeShipsRandomly(playerTwo.gameBoard);
// renderGameBoard(playerOneTable, playerOne.gameBoard);
// renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);

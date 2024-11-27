import { Player } from "./player";
import { Ship } from "./ship";
import { Gamemodes } from "./gamemode";
import "./styles.css";

const gamemodeForm = document.getElementById("gamemode-selection-form");
const shipPlacementContainer = document.getElementById(
  "ship-placement-container"
);
const preGameShipPlacementTable = document.getElementById(
  "pre-game-ship-placement-table"
);
const currentStatus = document.getElementById("current-status");
const gameOverDialog = document.getElementById("gameover-dialog");
const newGameButton = document.getElementById("new-game-button");
const winnerText = document.getElementById("winner-text");
const playerOneTable = document.getElementById("player-one-table");
const playerTwoTable = document.getElementById("player-two-table");
const shipLengths = [5, 4, 3, 3, 2];

let playerOne = new Player("Player One"); // Try to get some of these global varaibles into a class
let playerTwo = new Player("Player Two");
let currentPlayer = playerOne;
let gamemode = Gamemodes.SINGLEPLAYER;
let isGameOver = false;
let indexOfShipToBePlaced = 0;
let orientation = "h";

newGameButton.addEventListener("click", () => {
  gameOverDialog.close();
  gamemodeForm.style.display = "block";
  document.getElementById("battleship-pre-game-container").style.display =
    "block";
  shipPlacementContainer.style.display = "none";
  document.getElementById("battleship-main-game-container").style.display =
    "none";
  changeCurrentStatus("Gamemode Selection");
});

gamemodeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let selectedGamemode = document.querySelector(
    'input[name="gamemode"]:checked'
  ).value;
  gamemodeForm.style.display = "none";
  if (selectedGamemode === "singleplayer") {
    gamemode = Gamemodes.SINGLEPLAYER;
    resetGame();
  } else if (selectedGamemode === "multiplayer") {
    gamemode = Gamemodes.MULTIPLAYER;
    resetGame();
  }

  document.getElementById("battleship-pre-game-container").style.display =
    "inline-block";
  changeCurrentStatus("Player One Ship Placement");
  gamemodeForm.style.display = "none";
  shipPlacementContainer.style.display = "inline-block";
  renderShipPlacementGameBoard(playerOne.gameBoard);
});

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

const renderShipPlacementButtons = (gameboard) => {
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
    renderShipPlacementGameBoard(gameboard);
  });

  const randomizeButton = document.createElement("button");
  randomizeButton.className = "ship-placement-button";
  randomizeButton.id = "randomize-ships-button";
  randomizeButton.innerHTML = "Randomize";

  randomizeButton.addEventListener("click", () => {
    placeShipsRandomly(gameboard);
    indexOfShipToBePlaced = shipLengths.length;
    renderShipPlacementGameBoard(gameboard);
  });

  const resetButton = document.createElement("button");
  resetButton.className = "ship-placement-button";
  resetButton.id = "reset-ship-placement-button";
  resetButton.innerHTML = "Reset";

  resetButton.addEventListener("click", () => {
    gameboard.reset();
    indexOfShipToBePlaced = 0;
    renderShipPlacementGameBoard(gameboard);
  });

  const completeShipPlacementButton = document.createElement("button");
  completeShipPlacementButton.className = "ship-placement-button";
  completeShipPlacementButton.id = "completed-ship-placement-button";
  completeShipPlacementButton.innerHTML = "Done";

  completeShipPlacementButton.addEventListener("click", () => {
    const isShipPlacementFinished =
      indexOfShipToBePlaced === shipLengths.length;

    if (isShipPlacementFinished) {
      indexOfShipToBePlaced = 0;

      if (currentPlayer === playerOne && gamemode === Gamemodes.SINGLEPLAYER) {
        placeShipsRandomly(playerTwo.gameBoard);
        renderGameBoard(playerOneTable, playerOne.gameBoard);
        renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
        changeCurrentStatus("Player One's turn");
        document.getElementById("battleship-pre-game-container").style.display =
          "none";
        document.getElementById(
          "battleship-main-game-container"
        ).style.display = "flex";
      }
      if (currentPlayer === playerOne && gamemode === Gamemodes.MULTIPLAYER) {
        renderShipPlacementGameBoard(playerTwo.gameBoard);
        currentPlayer = playerTwo;
        changeCurrentStatus("Player Two Ship Placement");
      } else if (
        currentPlayer === playerTwo &&
        gamemode === Gamemodes.MULTIPLAYER
      ) {
        renderGameBoard(playerOneTable, playerOne.gameBoard);
        renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
        changeCurrentStatus("Player One's turn");
        currentPlayer = playerOne;
        document.getElementById("battleship-pre-game-container").style.display =
          "none";
        document.getElementById(
          "battleship-main-game-container"
        ).style.display = "flex";
      }
    }
  });

  shipPlacementButtonsContainer.appendChild(rotateButton);
  shipPlacementButtonsContainer.appendChild(randomizeButton);
  shipPlacementButtonsContainer.appendChild(resetButton);
  shipPlacementButtonsContainer.appendChild(completeShipPlacementButton);
};

const renderShipPlacementGameBoard = (gameboard) => {
  const gameBoardGrid = gameboard.grid;

  preGameShipPlacementTable.innerHTML = "";

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
          // TODO - Move this block of code elsewhere
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
                cell.style.backgroundColor = "#22FF22";
              }
            } else if (!shipCanBePlacedVertically) {
              for (let i = y; i < y + shipLength && i < 10; i++) {
                if (gameBoardGrid[i][x] instanceof Ship === false) {
                  let cell = document.getElementById(
                    `battleship-cell-x-${x}-y-${i}`
                  );
                  cell.style.backgroundColor = "#FF2222";
                }
              }
            }
          }
        });

        gameBoardCell.addEventListener("mouseout", () => {
          // TODO - Move this code elsewhere
          let shipLength = shipLengths[indexOfShipToBePlaced];
          if (orientation === "h") {
            for (let i = x; i < x + shipLength && i < 10; i++) {
              if (gameBoardGrid[y][i] instanceof Ship === false) {
                let cell = document.getElementById(
                  `battleship-cell-x-${i}-y-${y}`
                );
                cell.style.backgroundColor = "#2969b2";
              }
            }
          } else if (orientation === "v") {
            for (let i = y; i < y + shipLength && i < 10; i++) {
              if (gameBoardGrid[i][x] instanceof Ship === false) {
                let cell = document.getElementById(
                  `battleship-cell-x-${x}-y-${i}`
                );
                cell.style.backgroundColor = "#2969b2";
              }
            }
          }
        });

        gameBoardCell.addEventListener("click", () => {
          // Move this code elsewhere
          let shipLength = shipLengths[indexOfShipToBePlaced];
          if (orientation === "h") {
            let shipCanBePlacedHorizontally = gameboard.isPlaceable(
              [y, x],
              [y, x + shipLength - 1]
            );
            if (shipCanBePlacedHorizontally) {
              gameboard.placeShip([y, x], [y, x + shipLength - 1]);
              renderShipPlacementGameBoard(gameboard);
              indexOfShipToBePlaced++;
            }
          } else if (orientation === "v") {
            let shipCanBePlacedVertically = gameboard.isPlaceable(
              [y, x],
              [y + shipLength - 1, x]
            );
            if (shipCanBePlacedVertically) {
              gameboard.placeShip([y, x], [y + shipLength - 1, x]);
              renderShipPlacementGameBoard(gameboard);
              indexOfShipToBePlaced++;
            }
          }
        });
      }

      gameBoardCell.appendChild(gameBoardCellContent);
      gameBoardRow.appendChild(gameBoardCell);
    }
    preGameShipPlacementTable.appendChild(gameBoardRow);

    renderShipPlacementButtons(gameboard);
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
          if (
            currentPlayer === playerOne &&
            !isGameOver &&
            gameboard === playerTwo.gameBoard
          ) {
            gameboard.receiveAttack([y, x]);
            if (gamemode === Gamemodes.SINGLEPLAYER) {
              currentPlayer = playerTwo;
              renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
              changeCurrentStatus("Player Two's turn");
              setTimeout(() => {
                computerAttack(playerOne.gameBoard);
                renderGameBoard(playerOneTable, playerOne.gameBoard);
                changeCurrentStatus("Player One's turn");
                setTimeout(() => {
                  currentPlayer = playerOne;
                }, 500);
              }, 500);
            } else if (gamemode === Gamemodes.MULTIPLAYER) {
              currentPlayer = playerTwo;
              renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
              changeCurrentStatus(
                "You have 5 seconds to hand your device to the other player"
              );
              setTimeout(renderPlayerSwitch(currentPlayer), 5000);
            }
          } else if (
            currentPlayer === playerTwo &&
            !isGameOver &&
            gameboard === playerOne.gameBoard
          ) {
            if (gamemode === Gamemodes.MULTIPLAYER) {
              gameboard.receiveAttack([y, x]);
              changeCurrentStatus(
                "You have 5 seconds to hand your device to the other player"
              );
              renderOpponentGameBoard(playerOneTable, playerOne.gameBoard);
              currentPlayer = playerOne;
              setTimeout(renderPlayerSwitch(currentPlayer), 5000);
            }
          }
        });
      }
    }
    table.appendChild(gameBoardRow);
  }
};

const renderPlayerSwitch = (currentPlayer) => {
  checkGameState();

  if (currentPlayer === playerOne) {
    renderGameBoard(playerTwoTable, playerTwo.gameBoard);
    renderOpponentGameBoard(playerOneTable, playerOne.gameBoard);
    changeCurrentStatus("Player Two's turn");
  } else if (currentPlayer === playerTwo) {
    renderGameBoard(playerOneTable, playerOne.gameBoard);
    renderOpponentGameBoard(playerTwoTable, playerTwo.gameBoard);
    changeCurrentStatus("Player One's turn");
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

const changeCurrentStatus = (message) => {
  currentStatus.innerHTML = message;
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

const resetGame = () => {
  playerOne = new Player("Player One");
  playerTwo = new Player("Player Two");
  isGameOver = false;
  currentPlayer = playerOne;
};

const computerAttack = (opponentGameBoard) => {
  for (let y = 0; y < opponentGameBoard.grid.length; y++) {
    for (let x = 0; x < opponentGameBoard.grid[y].length; x++) {
      if (
        opponentGameBoard.positionIsHit([y, x]) &&
        opponentGameBoard.grid[y][x] instanceof Ship &&
        !opponentGameBoard.grid[y][x].isSunk()
      ) {
        let hasHitShip = false;
        if (opponentGameBoard.isOnBoard([y - 1, x])) {
          // North
          hasHitShip = opponentGameBoard.receiveAttack([y - 1, x]);
        }
        if (!hasHitShip) {
          if (opponentGameBoard.isOnBoard([y, x + 1])) {
            // East
            hasHitShip = opponentGameBoard.receiveAttack([y, x + 1]);
          }
        } else {
          checkGameState();
          return;
        }
        if (!hasHitShip) {
          if (opponentGameBoard.isOnBoard([y + 1, x])) {
            // South
            hasHitShip = opponentGameBoard.receiveAttack([y + 1, x]);
          }
        } else {
          checkGameState();
          return;
        }
        if (!hasHitShip) {
          if (opponentGameBoard.isOnBoard([y, x - 1])) {
            // West
            hasHitShip = opponentGameBoard.receiveAttack([y, x - 1]);
          }
        } else {
          checkGameState();
          return;
        }
        if (hasHitShip) {
          checkGameState();
          return;
        } else {
          continue;
        }
      }
    }
  }

  let hasHitShip = false;

  while (!hasHitShip) {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);

    if (!opponentGameBoard.positionIsHit([y, x])) {
      opponentGameBoard.receiveAttack([y, x]);
      hasHitShip = true;
    }
  }

  checkGameState();
  return;
};

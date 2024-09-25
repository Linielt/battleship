export const displayGameBoard = () => {
  const gameBoardTables = document.getElementsByClassName("battleship-table");

  for (let table of gameBoardTables) {
    for (let y = 0; y < 10; y++) {
      const gameBoardRow = document.createElement("tr");
      gameBoardRow.className = "battelship-row";
      for (let x = 0; x < 10; x++) {
        const gameBoardCell = document.createElement("td");
        gameBoardCell.className = "battleship-cell";
        const gameBoardCellContent = document.createElement("div");
        gameBoardCellContent.className = "battleship-cell-content";
        gameBoardCellContent.setAttribute("data-x", String(x));
        gameBoardCellContent.setAttribute("data-y", String(y));
        gameBoardCell.appendChild(gameBoardCellContent);
        gameBoardRow.appendChild(gameBoardCell);
      }
      table.appendChild(gameBoardRow);
    }
  }
};

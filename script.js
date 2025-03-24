// Gameboard Module (IIFE)
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const markCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, markCell, resetBoard };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  let player1, player2, currentPlayer, gameOver;

  const startGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    gameOver = false;
    Gameboard.resetBoard();
    DisplayController.updateGameStatus(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
    DisplayController.renderBoard();
    DisplayController.showRestartButton();
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.updateGameStatus(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes("") ? null : "tie";
  };

  const playTurn = (cellIndex) => {
    if (gameOver) return;

    if (Gameboard.markCell(cellIndex, currentPlayer.marker)) {
      DisplayController.renderBoard();

      const winner = checkWinner();
      if (winner) {
        gameOver = true;
        if (winner === "tie") {
          DisplayController.updateGameStatus("It's a tie!");
        } else {
          const winningPlayer = currentPlayer.marker === winner ? currentPlayer :
              (currentPlayer === player1 ? player2 : player1);
          DisplayController.updateGameStatus(`${winningPlayer.name} wins!`);
        }
        return;
      }

      switchPlayer();
    }
  };

  return { startGame, playTurn };
})();

const DisplayController = (() => {
  const gameboardElement = document.querySelector(".gameboard");
  const gameInfoElement = document.querySelector(".game-info");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const startButton = document.getElementById("start-btn");
  const restartButton = document.getElementById("restart-btn");

  const renderBoard = () => {
    gameboardElement.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      cellElement.addEventListener("click", () => GameController.playTurn(index));
      gameboardElement.appendChild(cellElement);
    });
  };

  const updateGameStatus = (message) => {
    gameInfoElement.textContent = message;
  };

  const showRestartButton = () => {
    startButton.style.display = "none";
    restartButton.style.display = "inline-block";
    player1Input.style.display = "none";
    player2Input.style.display = "none";
  };

  const bindEvents = () => {
    startButton.addEventListener("click", () => {
      GameController.startGame(player1Input.value, player2Input.value);
    });

    restartButton.addEventListener("click", () => {
      GameController.startGame(player1Input.value, player2Input.value);
    });
  };

  bindEvents();

  return {
    renderBoard,
    updateGameStatus,
    bindEvents,
    showRestartButton
  };
})();
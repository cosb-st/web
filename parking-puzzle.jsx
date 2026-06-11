
const { useState } = React;

function shuffle(array) {
  let newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function Puzzle() {
  const size = 3;

  const initial = shuffle([1,2,3,4,5,6,7,8,null]);

  const [board, setBoard] = useState(initial);

  const moveTile = (index) => {
    const emptyIndex = board.indexOf(null);

    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - size,
      emptyIndex + size
    ];

    if (validMoves.includes(index)) {
      let newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] =
      [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
    }
  };

  const resetGame = () => {
    setBoard(shuffle([1,2,3,4,5,6,7,8,null]));
  };

  const isSolved = () => {
    const correct = [1,2,3,4,5,6,7,8,null];
    return board.every((v, i) => v === correct[i]);
  };

  return (
    <div>
      <div className="board">
        {board.map((value, index) => (
          <div
            key={index}
            className={`tile ${value === null ? "empty" : ""}`}
            onClick={() => value !== null && moveTile(index)}
          >
            {value}
          </div>
        ))}
      </div>

      {isSolved() && <h2>🎉 성공!</h2>}

      <button onClick={resetGame}>다시 시작</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Puzzle />);

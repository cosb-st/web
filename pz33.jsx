
const { useState, useEffect } = React;

function PuzzleGame() {
  const initialTiles = [1,2,3,4,5,6,7,8,null];
  const [tiles, setTiles] = useState(shuffle(initialTiles));
  const [moves, setMoves] = useState(0);

  function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (row > 0) neighbors.push(index - 3);
    if (row < 2) neighbors.push(index + 3);
    if (col > 0) neighbors.push(index - 1);
    if (col < 2) neighbors.push(index + 1);

    return neighbors;
  }

  function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    if (getNeighbors(index).includes(emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] =
        [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  }

  function resetGame() {
    setTiles(shuffle(initialTiles));
    setMoves(0);
  }

  function isSolved() {
    return tiles.slice(0, 8).every((v, i) => v === i + 1);
  }

  useEffect(() => {
    if (isSolved()) {
      setTimeout(() => alert("🎉 퍼즐 완성!"), 100);
    }
  }, [tiles]);

  return (
    <div className="container">
      <h1>🧩 퍼즐 게임</h1>

      <div className="grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => moveTile(index)}
            className={`tile ${tile ? "filled" : "empty"}`}
          >
            {tile}
          </div>
        ))}
      </div>

      <div>이동 횟수: {moves}</div>

      <button onClick={resetGame}>다시 시작</button>
    </div>
  );
}

// ✅ React 렌더링
ReactDOM.createRoot(document.getElementById("root"))
  .render(<PuzzleGame />);

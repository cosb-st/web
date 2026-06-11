
const { useState, useEffect } = React;

function PuzzleGame4x4() {
  const size = 4;
  const initialTiles = [...Array(15).keys()].map(n => n + 1).concat(null);

  const [tiles, setTiles] = useState(shuffle(initialTiles));
  const [moves, setMoves] = useState(0);

  function shuffle(array) {
    let arr = [...array];

    do {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (!isSolvable(arr));

    return arr;
  }

  // ✅ 퍼즐이 풀 수 있는 상태인지 검사
  function isSolvable(arr) {
    let invCount = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) invCount++;
      }
    }

    const emptyRow = size - Math.floor(arr.indexOf(null) / size);

    if (size % 2 !== 0) {
      return invCount % 2 === 0;
    } else {
      return (emptyRow % 2 === 0) !== (invCount % 2 === 0);
    }
  }

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / size);
    const col = index % size;

    if (row > 0) neighbors.push(index - size);
    if (row < size - 1) neighbors.push(index + size);
    if (col > 0) neighbors.push(index - 1);
    if (col < size - 1) neighbors.push(index + 1);

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
    return tiles.slice(0, size * size - 1)
      .every((v, i) => v === i + 1);
  }

  useEffect(() => {
    if (isSolved()) {
      setTimeout(() => alert("🎉 4x4 퍼즐 완성!"), 100);
    }
  }, [tiles]);

  return (
    <div className="container">
      <h1> Try it </h1>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 80px)`
        }}
      >
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

// ✅ 렌더링
ReactDOM.createRoot(document.getElementById("root"))
  .render(<PuzzleGame4x4 />);

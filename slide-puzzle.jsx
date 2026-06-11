
const { useState, useEffect } = React;

function PuzzleGame() {
  const [size, setSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    startGame(3);
  }, []);

  function startGame(newSize) {
    const arr = [...Array(newSize * newSize - 1).keys()]
      .map(n => n + 1)
      .concat(null);

    const shuffled = shuffle(arr, newSize);

    setSize(newSize);
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  function shuffle(array, size) {
    let arr = [...array];

    do {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (!isSolvable(arr, size));

    return arr;
  }

  function isSolvable(arr, size) {
    let inv = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
      }
    }

    if (size % 2 !== 0) return inv % 2 === 0;

    const emptyRow = size - Math.floor(arr.indexOf(null) / size);
    return (emptyRow % 2 === 0) !== (inv % 2 === 0);
  }

  function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);

    if (getNeighbors(emptyIndex).includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] =
        [newTiles[emptyIndex], newTiles[index]];

      setTiles(newTiles);
      setMoves(moves + 1);
    }
  }

  function getNeighbors(index) {
    const row = Math.floor(index / size);
    const col = index % size;
    const n = [];

    if (row > 0) n.push(index - size);
    if (row < size - 1) n.push(index + size);
    if (col > 0) n.push(index - 1);
    if (col < size - 1) n.push(index + 1);

    return n;
  }

  function isSolved() {
    return tiles.length &&
      tiles.slice(0, size * size - 1)
      .every((v, i) => v === i + 1);
  }

  useEffect(() => {
    if (isSolved()) {
      setRunning(false);
      setTimeout(() => {
        alert(`🎉 완료!\n난이도: ${size}x${size}\n시간: ${time}s\n이동: ${moves}`);
      }, 100);
    }
  }, [tiles]);

  return (
    <div className="game-wrapper">
      <div className="card">
        <h1>Slide Puzzle</h1>

        <div className="controls">
          <button onClick={() => startGame(3)}>3x3</button>
          <button onClick={() => startGame(4)}>4x4</button>
          <button onClick={() => startGame(5)}>5x5</button>
        </div>

        <div className="hud">
          <span>⏱ {time}s</span>
          <span>🎯 {moves}</span>
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${size}, 70px)` }}
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

        <button className="restart" onClick={() => startGame(size)}>
          다시 시작
        </button>
      </div>

      {/* ✅ 스타일 */}
      <style>{`
        body {
          margin: 0;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          font-family: Arial;
        }

        .game-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .card {
          background: #111827;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          text-align: center;
          color: white;
        }

        h1 {
          margin-bottom: 10px;
          font-size: 24px;
        }

        .controls button {
          margin: 5px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: #334155;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }

        .controls button:hover {
          background: #3b82f6;
          transform: scale(1.05);
        }

        .hud {
          margin: 10px 0;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #94a3b8;
        }

        .grid {
          display: grid;
          gap: 10px;
          margin-top: 10px;
        }

        .tile {
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.15s;
        }

        .tile.filled {
          background: linear-gradient(145deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .tile.filled:hover {
          transform: scale(1.1);
        }

        .tile.empty {
          background: #1f2937;
        }

        .restart {
          margin-top: 15px;
          padding: 10px;
          width: 100%;
          border-radius: 10px;
          border: none;
          background: #22c55e;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }

        .restart:hover {
          background: #16a34a;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

// 렌더링
ReactDOM.createRoot(document.getElementById("root"))
  .render(<PuzzleGame />);


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

  function isSolved() {
    return tiles.length &&
      tiles.slice(0, size * size - 1)
      .every((v, i) => v === i + 1);
  }

  useEffect(() => {
    if (isSolved()) {
      setRunning(false);
      setTimeout(() => {
        alert(`🎉 완료!\n${size}x${size}\n시간: ${time}s\n이동: ${moves}`);
      }, 100);
    }
  }, [tiles]);

  return (
    <div className="wrapper">
      <div className="panel">
        <h1>🧩 Slide Puzzle</h1>

        <div className="controls">
          <button onClick={() => startGame(3)}>3x3</button>
          <button onClick={() => startGame(4)}>4x4</button>
          <button onClick={() => startGame(5)}>5x5</button>
        </div>

        <div className="info">
          ⏱ {time}s | 🎯 {moves}
        </div>

        {/* ✅ 퍼즐 보드 */}
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}
        >
          {tiles.map((tile, index) => {
            const movable = getNeighbors(tiles.indexOf(null)).includes(index);

            return (
              <div
                key={index}
                onClick={() => moveTile(index)}
                className={`tile ${tile ? "filled" : "empty"} ${movable ? "movable" : ""}`}
              >
                {tile}
              </div>
            );
          })}
        </div>

        <button className="restart" onClick={() => startGame(size)}>
          다시 시작
        </button>
      </div>

      {/* ✅ 스타일 */}
      <style>{`
        body {
          margin: 0;
          background: #2c2f33;
          font-family: Arial;
        }

        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .panel {
          background: #3b3f45;
          padding: 25px;
          border-radius: 20px;
          box-shadow: inset 4px 4px 10px #2a2d31,
                      inset -4px -4px 10px #4a4e55;
          text-align: center;
          color: white;
        }

        h1 {
          margin-bottom: 10px;
        }

        .controls button {
          margin: 5px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: #6b7280;
          color: white;
          cursor: pointer;
          box-shadow: 2px 2px 4px #222;
        }

        .controls button:hover {
          background: #3b82f6;
        }

        .info {
          margin: 10px 0;
          color: #d1d5db;
        }

        .board {
          display: grid;
          gap: 8px;
          padding: 10px;
          background: #1f2937;
          border-radius: 12px;
          box-shadow: inset 4px 4px 8px #111,
                      inset -2px -2px 6px #374151;
        }

        .tile {
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
          font-weight: bold;
          border-radius: 10px;
          user-select: none;
        }

        /* ✅ 실제 퍼즐 블록 느낌 */
        .tile.filled {
          background: linear-gradient(145deg, #e5e7eb, #9ca3af);
          color: #111;
          box-shadow: 
            4px 4px 6px #1f2937,
            -2px -2px 4px #ffffff33,
            inset -2px -2px 4px #6b7280,
            inset 2px 2px 4px #fff;
          cursor: pointer;
        }

        .tile.filled:active {
          box-shadow:
            inset 3px 3px 6px #1f2937,
            inset -2px -2px 4px #fff;
          transform: translateY(2px);
        }

        .tile.empty {
          background: #111827;
        }

        /* ✅ 움직일 수 있는 타일 강조 */
        .tile.movable {
          outline: 3px solid #facc15;
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
          box-shadow: 2px 2px 5px #111;
        }

        .restart:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root"))
  .render(<PuzzleGame />);

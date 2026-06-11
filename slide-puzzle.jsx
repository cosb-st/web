
const { useState, useEffect } = React;

function PuzzleGame() {
  const [size, setSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => startGame(3), []);

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
    const t = setInterval(() => setTime(x => x + 1), 1000);
    return () => clearInterval(t);
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
    const empty = tiles.indexOf(null);
    if (getNeighbors(empty).includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[empty]] =
        [newTiles[empty], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  }

  function isSolved() {
    return tiles.slice(0, size * size - 1)
      .every((v, i) => v === i + 1);
  }

  useEffect(() => {
    if (tiles.length && isSolved()) {
      setRunning(false);
      setTimeout(() => {
        alert(`🎉 완료!\n${size}x${size}\n시간:${time}s 이동:${moves}`);
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

        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}
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
          color: white;
        }

        .controls button {
          margin: 5px;
          padding: 8px;
          background: #6b7280;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
        }

        .info {
          margin: 10px 0;
        }

        .board {
          display: grid;
          gap: 8px;
          padding: 12px;
          background: #1f2937;
          border-radius: 14px;
        }

        /* ✅ 핵심: 돌출된 퍼즐 타일 */
        .tile {
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
          font-weight: bold;
          position: relative;
          border-radius: 12px;
        }

        .tile.filled {
          background: #d1d5db;

          /* 👉 위쪽 돌출 */
          box-shadow:
            inset 0 -3px 4px #9ca3af,
            inset 0 3px 4px #ffffff,
            0 4px 6px rgba(0,0,0,0.4);

          border-top: 3px solid #fff;
          border-left: 2px solid #eee;
          border-right: 2px solid #888;
          border-bottom: 3px solid #666;

          cursor: pointer;
        }

        /* 👉 눌리는 느낌 */
        .tile.filled:active {
          transform: translateY(2px);
          box-shadow:
            inset 2px 2px 6px #666,
            inset -2px -2px 6px #fff;
        }

        .tile.empty {
          background: #111827;
        }

        .restart {
          margin-top: 15px;
          padding: 10px;
          width: 100%;
          border-radius: 10px;
          border: none;
          background: #22c55e;
          color: white;
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root"))
  .render(<PuzzleGame />);

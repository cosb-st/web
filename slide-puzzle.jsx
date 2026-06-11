
const { useState, useEffect } = React;

function PuzzleGame() {
  const [size, setSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  // ✅ 게임 시작
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

  // ✅ 최초 실행
  useEffect(() => {
    startGame(3);
  }, []);

  // ✅ 타이머
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  // ✅ 셔플 (항상 풀 수 있는 상태)
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

  // ✅ 해결 가능 여부
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
        alert(`🎉 완료!\n난이도: ${size}x${size}\n시간: ${time}s\n이동: ${moves}`);
      }, 100);
    }
  }, [tiles]);

  return (
    <div className="container">
      <h1> Try it </h1>

      {/* ✅ 난이도 선택 */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => startGame(3)}>3x3</button>
        <button onClick={() => startGame(4)}>4x4</button>
        <button onClick={() => startGame(5)}>5x5</button>
      </div>

      {/* ✅ 상태 */}
      <div style={{ marginBottom: "10px" }}>
        ⏱ {time}s | 이동 {moves}
      </div>

      {/* ✅ 퍼즐 */}
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

      <button onClick={() => startGame(size)}>다시 시작</button>
    </div>
  );
}

// ✅ 렌더링
ReactDOM.createRoot(document.getElementById("root"))
  .render(<PuzzleGame />);

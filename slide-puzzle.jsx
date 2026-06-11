
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

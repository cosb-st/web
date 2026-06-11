
const SIZE = 6;

// ✅ 스타일을 JSX 안에서 주입
const style = document.createElement("style");
style.innerHTML = `
  body {
    text-align: center;
    font-family: Arial;
    background: #f5f5f5;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(6, 70px);
    gap: 5px;
    justify-content: center;
    margin-top: 20px;
  }

  .cell {
    width: 70px;
    height: 70px;
    background: #ddd;
    border-radius: 8px;
  }

  .car {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
  }

  .red { background: #e53935; }
  .blue { background: #1e88e5; }
  .green { background: #43a047; }
  .orange { background: #fb8c00; }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
  }
`;
document.head.appendChild(style);

// ✅ 초기 차량
const initialCars = [
  { id: "R", x: 1, y: 2, length: 2, orientation: "H", color: "red" },
  { id: "A", x: 0, y: 0, length: 3, orientation: "V", color: "blue" },
  { id: "B", x: 3, y: 0, length: 2, orientation: "V", color: "green" },
  { id: "C", x: 4, y: 3, length: 2, orientation: "H", color: "orange" },
];

function App() {
  const [cars, setCars] = React.useState(initialCars);
  const [selected, setSelected] = React.useState(null);

  // ✅ 보드 생성
  const board = Array(SIZE * SIZE).fill(null);

  cars.forEach(car => {
    for (let i = 0; i < car.length; i++) {
      const x = car.orientation === "H" ? car.x + i : car.x;
      const y = car.orientation === "V" ? car.y + i : car.y;
      board[y * SIZE + x] = car;
    }
  });

  // ✅ 이동 가능 여부
  const canMove = (car, dx, dy) => {
    if (car.orientation === "H") {
      if (dx === -1) {
        return car.x > 0 && !board[car.y * SIZE + (car.x - 1)];
      }
      if (dx === 1) {
        let right = car.x + car.length;
        return right < SIZE && !board[car.y * SIZE + right];
      }
    }

    if (car.orientation === "V") {
      if (dy === -1) {
        return car.y > 0 && !board[(car.y - 1) * SIZE + car.x];
      }
      if (dy === 1) {
        let bottom = car.y + car.length;
        return bottom < SIZE && !board[bottom * SIZE + car.x];
      }
    }

    return false;
  };

  // ✅ 이동 실행
  const moveCar = (car, dx, dy) => {
    if (!canMove(car, dx, dy)) return;

    setCars(prev =>
      prev.map(c =>
        c.id === car.id
          ? { ...c, x: c.x + dx, y: c.y + dy }
          : c
      )
    );
  };

  // ✅ 키보드 이동
  React.useEffect(() => {
    const handleKey = (e) => {
      if (!selected) return;

      if (e.key === "ArrowLeft") moveCar(selected, -1, 0);
      if (e.key === "ArrowRight") moveCar(selected, 1, 0);
      if (e.key === "ArrowUp") moveCar(selected, 0, -1);
      if (e.key === "ArrowDown") moveCar(selected, 0, 1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  const isWin = () => {
    const red = cars.find(c => c.id === "R");
    return red.x + red.length === SIZE;
  };

  return (
    <div>
      <h1>🚗 탈출 주차 퍼즐</h1>
      <p>빨간 차를 오른쪽으로 탈출시키세요</p>

      <div className="board">
        {board.map((cell, i) => {
          const isSelected = cell && selected && cell.id === selected.id;

          return (
            <div
              key={i}
              className="cell"
              onClick={() => cell && setSelected(cell)}
              style={{
                border: isSelected ? "3px solid black" : "none"
              }}
            >
              {cell && (
                <div className={`car ${cell.color}`}>
                  {cell.id}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isWin() && <h2>🎉 성공!</h2>}

      <p>👉 차량 클릭 후 방향키로 이동</p>

      <button onClick={() => setCars(initialCars)}>
        다시 시작
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

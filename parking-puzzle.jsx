
const SIZE = 6;

/*
차량 구조:
id, 방향, 위치(x,y), 길이
orientation: "H" (가로) / "V" (세로)
*/
const initialCars = [
  { id: "R", x: 1, y: 2, length: 2, orientation: "H", color: "red" }, // 목표
  { id: "A", x: 0, y: 0, length: 3, orientation: "V", color: "blue" },
  { id: "B", x: 3, y: 0, length: 2, orientation: "V", color: "green" },
  { id: "C", x: 4, y: 3, length: 2, orientation: "H", color: "orange" },
];

function App() {
  const [cars, setCars] = React.useState(initialCars);
  const [selected, setSelected] = React.useState(null);

  // 보드 생성
  const board = Array(SIZE * SIZE).fill(null);

  cars.forEach(car => {
    for (let i = 0; i < car.length; i++) {
      const x = car.orientation === "H" ? car.x + i : car.x;
      const y = car.orientation === "V" ? car.y + i : car.y;
      board[y * SIZE + x] = car;
    }
  });

  // 이동 가능 체크
  const canMove = (car, dx, dy) => {
    let newX = car.x + dx;
    let newY = car.y + dy;

    if (car.orientation === "H") {
      if (dx === -1) {
        return newX >= 0 && !board[car.y * SIZE + newX];
      }
      if (dx === 1) {
        let right = car.x + car.length;
        return right < SIZE && !board[car.y * SIZE + right];
      }
    }

    if (car.orientation === "V") {
      if (dy === -1) {
        return newY >= 0 && !board[newY * SIZE + car.x];
      }
      if (dy === 1) {
        let bottom = car.y + car.length;
        return bottom < SIZE && !board[bottom * SIZE + car.x];
      }
    }

    return false;
  };

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

  const handleClick = (car) => {
    if (!car) return;

    if (!selected) {
      setSelected(car);
    } else {
      if (selected.id === car.id) {
        setSelected(null);
      } else {
        setSelected(car);
      }
    }
  };

  // 키보드 이동 (선택된 차량)
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
      <div className="board">
        {board.map((cell, i) => {
          const isSelected = cell && selected && cell.id === selected.id;
          return (
            <div
              key={i}
              className="cell"
              onClick={() => handleClick(cell)}
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

      {isWin() && <h2>🎉 탈출 성공!</h2>}

      <p>👉 차량 클릭 후 방향키로 이동</p>

      <button onClick={() => setCars(initialCars)}>
        다시 시작
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

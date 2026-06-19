
const { useState, useEffect, useRef } = React;

function Tetris({ goBack }) {
    // 게임 설정 상수
    const COLS = 10;
    const ROWS = 20;
    const SPEED = 500; // 블록이 내려오는 속도 (ms)

    // 테트로미노(블록) 모양 정의 (0: 빈칸, 1~7: 블록 종류별 색상 인덱스)
    const SHAPES = [
        [], // 빈 공간용 더미
        [[1, 1, 1, 1]], // I
        [[2, 2, 2], [0, 2, 0]], // T
        [[3, 3], [3, 3]], // O
        [[0, 4, 4], [4, 4, 0]], // Z
        [[5, 5, 0], [0, 5, 5]], // S
        [[6, 0, 0], [6, 6, 6]], // J
        [[0, 0, 7], [7, 7, 7]]  // L
    ];

    // 블록별 Tailwind 색상 맵핑
    const COLORS = [
        'bg-slate-200',     // 0: 빈칸
        'bg-cyan-500',      // 1: I
        'bg-purple-500',    // 2: T
        'bg-yellow-400',    // 3: O
        'bg-red-500',       // 4: Z
        'bg-green-500',     // 5: S
        'bg-blue-500',      // 6: J
        'bg-orange-500'     // 7: L
    ];

    // 상태 관리
    const [grid, setGrid] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    
    // 리렌더링을 유발하지 않고 타이머 내에서 최신 값을 참조하기 위한 Ref 활용
    const currentPiece = useRef({ shape: [], x: 0, y: 0, id: 0 });
    const gridRef = useRef(grid);
    gridRef.current = grid;

    // 새로운 랜덤 블록 생성
    const spawnPiece = () => {
        const id = Math.floor(Math.random() * 7) + 1;
        const shape = SHAPES[id];
        currentPiece.current = {
            id: id,
            shape: shape,
            x: Math.floor((COLS - shape[0].length) / 2),
            y: 0
        };

        // 블록을 생성하자마자 충돌이 나면 게임 오버
        if (checkCollision(currentPiece.current.x, currentPiece.current.y, shape)) {
            setGameOver(true);
        }
    };

    // 충돌 체크 함수
    const checkCollision = (ax, ay, shape) => {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0) {
                    const nextX = ax + c;
                    const nextY = ay + r;

                    if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
                    if (nextY >= 0 && gridRef.current[nextY][nextX] !== 0) return true;
                }
            }
        }
        return false;
    };

    // 블록 고정 및 줄 삭제 처리
    const lockPiece = () => {
        const { x, y, shape, id } = currentPiece.current;
        const newGrid = gridRef.current.map(row => [...row]);

        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0 && y + r >= 0) {
                    newGrid[y + r][x + c] = id;
                }
            }
        }

        // 꽉 찬 줄 제거 및 점수 계산
        let linesCleared = 0;
        const filteredGrid = newGrid.filter(row => {
            const isFull = row.every(cell => cell !== 0);
            if (isFull) linesCleared++;
            return !isFull;
        });

        while (filteredGrid.length < ROWS) {
            filteredGrid.unshift(Array(COLS).fill(0));
        }

        if (linesCleared > 0) {
            setScore(prev => prev + (linesCleared * 100));
        }

        setGrid(filteredGrid);
        spawnPiece();
    };

    // 움직임 제어 함수
    const move = (dirX, dirY) => {
        if (gameOver) return;
        const nextX = currentPiece.current.x + dirX;
        const nextY = currentPiece.current.y + dirY;

        if (!checkCollision(nextX, nextY, currentPiece.current.shape)) {
            currentPiece.current.x = nextX;
            currentPiece.current.y = nextY;
            setGrid([...gridRef.current]); // 리렌더링 유발용
        } else if (dirY === 1) {
            // 아래로 떨어지다 부딪힌 경우 고정
            lockPiece();
        }
    };

    // 블록 회전 함수
    const rotate = () => {
        if (gameOver) return;
        const shape = currentPiece.current.shape;
        const n = shape.length;
        const m = shape[0].length;
        
        // 행렬 회전 (시계 방향)
        const rotated = Array(m).fill(null).map(() => Array(n).fill(0));
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < m; c++) {
                rotated[c][n - 1 - r] = shape[r][c];
            }
        }

        // 회전이 가능한 위치일 때만 적용
        if (!checkCollision(currentPiece.current.x, currentPiece.current.y, rotated)) {
            currentPiece.current.shape = rotated;
            setGrid([...gridRef.current]);
        }
    };

    // 게임 시작 및 타이머 루프 설정
    const initGame = () => {
        setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
        setScore(0);
        setGameOver(false);
        spawnPiece();
    };

    useEffect(() => {
        initGame();
        
        // 키보드 이벤트 리스너 등록
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault(); // 방향키 스크롤 방지
            }
            if (e.key === 'ArrowLeft') move(-1, 0);
            if (e.key === 'ArrowRight') move(1, 0);
            if (e.key === 'ArrowDown') move(0, 1);
            if (e.key === 'ArrowUp') rotate();
        };
        window.addEventListener('keydown', handleKeyDown);

        // 일정 시간마다 블록 아래로 떨어뜨리기
        const interval = setInterval(() => {
            if (!gameOver) move(0, 1);
        }, SPEED);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(interval);
        };
    }, [gameOver]);

    // 화면에 그릴 렌더링용 임시 그리드 계산 (고정된 그리드 + 현재 조작중인 블록)
    const displayGrid = grid.map(row => [...row]);
    const { x, y, shape, id } = currentPiece.current;
    if (shape && !gameOver) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0 && y + r >= 0 && y + r < ROWS && x + c >= 0 && x + c < COLS) {
                    displayGrid[y + r][x + c] = id;
                }
            }
        }
    }

    return (
        <div class="flex flex-col items-center">
            {/* 상단바 */}
            <div class="w-full flex justify-between items-center mb-4">
                <button onClick={goBack} class="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer">
                    ⬅ 목록으로
                </button>
                <div class="text-sm bg-slate-100 px-4 py-2 rounded-full font-medium">
                    SCORE: <span class="text-indigo-600 font-extrabold">{score}</span>
                </div>
            </div>

            <h2 class="text-3xl font-black mb-4 text-slate-800">🧱 테트리스</h2>

            {/* 게임판 인프라 */}
            <div class="relative bg-slate-900 p-2 rounded-2xl shadow-xl border-4 border-slate-700">
                <div class="grid grid-cols-10 gap-[1px] w-64 h-[512px] sm:w-72 sm:h-[576px]">
                    {displayGrid.map((row, rIdx) => 
                        row.map((cell, cIdx) => (
                            <div 
                                key={`${rIdx}-${cIdx}`} 
                                class={`${cell === 0 ? 'bg-slate-800' : COLORS[cell]} rounded-[2px] transition-colors duration-70 border-t border-white/10`}
                            />
                        ))
                    )}
                </div>

                {/* 게임 오버 오버레이 */}
                {gameOver && (
                    <div class="absolute inset-0 bg-slate-900/90 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in">
                        <p class="text-3xl font-black text-red-500 mb-2">GAME OVER</p>
                        <p class="text-slate-400 mb-6 text-sm">최종 점수: {score}점</p>
                        <button 
                            onClick={initGame}
                            class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                            다시 시작하기
                        </button>
                    </div>
                )}
            </div>

            {/* 화면 조작용 버튼 (모바일 및 편의용) */}
            <div class="mt-6 w-full max-w-xs grid grid-cols-3 gap-2">
                <div></div>
                <button onClick={rotate} class="bg-slate-200 active:bg-slate-300 p-3 rounded-xl font-bold text-slate-700 cursor-pointer shadow-sm text-center">🔄 회전</button>
                <div></div>
                <button onClick={() => move(-1, 0)} class="bg-slate-200 active:bg-slate-300 p-3 rounded-xl font-bold text-slate-700 cursor-pointer shadow-sm text-center">◀ 좌</button>
                <button onClick={() => move(0, 1)} class="bg-slate-200 active:bg-slate-300 p-3 rounded-xl font-bold text-slate-700 cursor-pointer shadow-sm text-center">▼ 하</button>
                <button onClick={() => move(1, 0)} class="bg-slate-200 active:bg-slate-300 p-3 rounded-xl font-bold text-slate-700 cursor-pointer shadow-sm text-center">▶ 우</button>
            </div>
            <p class="text-xs text-slate-400 mt-4 hidden sm:block">💡 PC에서는 키보드 방향키(↑: 회전)로도 조작할 수 있습니다.</p>
        </div>
    );
}

// 글로벌 등록
window.Tetris = Tetris;

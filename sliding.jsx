
// 전역 React 객체에서 필요한 훅 추출
const { useState, useEffect } = React;

function SlidingPuzzle({ goBack }) {
    const SIZE = 3; // 3x3 격자
    const CORRECT_BOARD = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 정답 배열 (0은 빈칸)

    const [board, setBoard] = useState([]);
    const [isWon, setIsWon] = useState(false);
    const [moves, setMoves] = useState(0);

    // 게임 초기화 및 퍼즐 섞기
    const initGame = () => {
        let shuffled;
        while (true) {
            // 배열 무작위 셔플
            shuffled = [...CORRECT_BOARD].sort(() => Math.random() - 0.5);
            
            // 슬라이딩 퍼즐은 무작위로 섞었을 때 풀 수 없는 조합이 존재합니다 (Inversion 갯수로 판단)
            if (isSolvable(shuffled) && !isGameOver(shuffled)) {
                break;
            }
        }
        setBoard(shuffled);
        setIsWon(false);
        setMoves(0);
    };

    // 풀 수 있는 퍼즐인지 검증하는 함수 (수학적 규칙)
    const isSolvable = (grid) => {
        let inversions = 0;
        const filtered = grid.filter(num => num !== 0);
        for (let i = 0; i < filtered.length; i++) {
            for (let j = i + 1; j < filtered.length; j++) {
                if (filtered[i] > filtered[j]) inversions++;
            }
        }
        return inversions % 2 === 0;
    };

    // 정답 확인 함수
    const isGameOver = (currentBoard) => {
        return JSON.stringify(currentBoard) === JSON.stringify(CORRECT_BOARD);
    };

    // 컴포넌트 첫 로드 시 게임 시작
    useEffect(() => {
        initGame();
    }, []);

    // 타일 클릭 이벤트
    const handleTileClick = (index) => {
        if (isWon) return;

        const emptyIndex = board.indexOf(0);
        
        // 클릭한 타일과 빈칸의 행/열 계산
        const tileRow = Math.floor(index / SIZE);
        const tileCol = index % SIZE;
        const emptyRow = Math.floor(emptyIndex / SIZE);
        const emptyCol = emptyIndex % SIZE;

        // 상하좌우로 인접해 있는지 확인
        const isAdjacent = (Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol)) === 1;

        if (isAdjacent) {
            const newBoard = [...board];
            // 값 스왑
            newBoard[emptyIndex] = board[index];
            newBoard[index] = 0;
            
            setBoard(newBoard);
            setMoves(prev => prev + 1);

            // 승리 조건 체크
            if (isGameOver(newBoard)) {
                setIsWon(true);
            }
        }
    };

    return (
        <div class="flex flex-col items-center">
            {/* 상단 컨트롤 영역 */}
            <div class="w-full flex justify-between items-center mb-6">
                <button 
                    onClick={goBack}
                    class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                    ⬅ 목록으로
                </button>
                <div class="text-sm bg-slate-100 px-4 py-2 rounded-full font-medium">
                    움직인 횟수: <span class="text-indigo-600 font-bold">{moves}</span>
                </div>
            </div>

            <h2 class="text-3xl font-black text-center mb-2 text-slate-800">🧩 슬라이딩 퍼즐</h2>
            <p class="text-sm text-slate-400 mb-6 text-center">빈칸 옆의 타일을 눌러 1부터 8까지 순서대로 맞춰보세요!</p>

            {/* 퍼즐 보드 */}
            <div class="grid grid-cols-3 gap-3 bg-slate-300 p-3 rounded-2xl w-72 h-72 sm:w-80 sm:h-80 shadow-inner">
                {board.map((tile, index) => {
                    if (tile === 0) {
                        // 빈칸 스타일
                        return <div key={index} class="bg-slate-300 rounded-xl"></div>;
                    }
                    return (
                        <button
                            key={index}
                            onClick={() => handleTileClick(index)}
                            disabled={isWon}
                            class="bg-white hover:bg-indigo-50 text-indigo-600 text-3xl font-extrabold rounded-xl shadow-md border-b-4 border-slate-200 active:border-b-0 active:translate-y-[4px] transition-all flex items-center justify-center cursor-pointer select-none"
                        >
                            {tile}
                        </button>
                    );
                })}
            </div>

            {/* 승리 메시지 및 게임 리셋 */}
            {isWon ? (
                <div class="mt-6 text-center animate-bounce">
                    <p class="text-2xl font-black text-emerald-500 mb-2">🎉 축하합니다! 성공하셨습니다! 🎉</p>
                    <button 
                        onClick={initGame}
                        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                        다시 도전하기
                    </button>
                </div>
            ) : (
                <button 
                    onClick={initGame}
                    class="mt-6 bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                    🔄 셔플 (다시 시작)
                </button>
            )}
        </div>
    );
}

// 다른 파일(index.html)에서 접근할 수 있도록 전역 스코프에 등록
window.SlidingPuzzle = SlidingPuzzle;

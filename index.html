
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 간단한 3x3 숫자 퍼즐 (빈칸 이동)
export default function PuzzleGame() {
  const initialTiles = [1,2,3,4,5,6,7,8,null];
  const [tiles, setTiles] = useState(shuffle(initialTiles));
  const [moves, setMoves] = useState(0);

  function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (row > 0) neighbors.push(index - 3);
    if (row < 2) neighbors.push(index + 3);
    if (col > 0) neighbors.push(index - 1);
    if (col < 2) neighbors.push(index + 1);

    return neighbors;
  }

  function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    if (getNeighbors(index).includes(emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  }

  function resetGame() {
    setTiles(shuffle(initialTiles));
    setMoves(0);
  }

  function isSolved() {
    return tiles.slice(0, 8).every((val, idx) => val === idx + 1);
  }

  useEffect(() => {
    if (isSolved()) {
      setTimeout(() => alert("🎉 퍼즐 완성!"), 100);
    }
  }, [tiles]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">🧩 퍼즐 게임</h1>

      <Card className="p-4">
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile, index) => (
              <div
                key={index}
                onClick={() => moveTile(index)}
                className={`w-20 h-20 flex items-center justify-center text-xl font-bold rounded-xl cursor-pointer
                  ${tile ? "bg-blue-500 text-white" : "bg-gray-300"}`}
              >
                {tile}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-lg">이동 횟수: {moves}</div>

      <Button className="mt-4" onClick={resetGame}>다시 시작</Button>
    </div>
  );
}

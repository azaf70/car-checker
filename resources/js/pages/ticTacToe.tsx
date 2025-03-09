import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TicTacToe() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [winningSquares, setWinningSquares] = useState<number[]>([]);

    function handleClick(i: number) {
        const newSquares = squares.slice();
        const currentWinner = calculateWinner(squares);
        if (squares[i] || currentWinner.winner) {
            return;
        }

        if (xIsNext) {
            newSquares[i] = 'X';
        } else {
            newSquares[i] = 'O';
        }

        setXIsNext(!xIsNext);
        setSquares(newSquares);
    }

    const { winner, line } = calculateWinner(squares);

    useEffect(() => {
        if (winner && line && (winningSquares.length === 0 || !line.every((square, index) => winningSquares[index] === square))) {
            setWinningSquares(line);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [winner, line, winningSquares]);

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (squares.every((square) => square !== null)) {
        status = 'Draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    function calculateWinner(squares: string[]): { winner: string | null; line: number[] | null } {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: [a, b, c] };
            }
        }

        return { winner: null, line: null };
    }

    function resetGame() {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
        setWinningSquares([]);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-8 text-center text-3xl font-bold text-blue-600">Tic Tac Toe</h1>

                <div className="mb-4 text-center text-2xl text-gray-600">{status}</div>

                <div className="mb-4 grid grid-cols-3 gap-2">
                    {squares.map((square, index) => (
                        <Square
                            key={index}
                            value={squares[index]}
                            onSquareClick={() => handleClick(index)}
                            isWinning={winningSquares.includes(index)}
                        />
                    ))}
                </div>

                <motion.button
                    onClick={resetGame}
                    className="w-full rounded-lg bg-blue-500 py-2 font-bold text-white transition-colors hover:bg-blue-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Reset Game
                </motion.button>
            </div>
        </div>
    );
}

function Square({ value, onSquareClick, isWinning }: { value: string | null; onSquareClick: () => void; isWinning?: boolean }) {
    return (
        <motion.button
            onClick={onSquareClick}
            className={`flex h-20 w-20 cursor-pointer items-center justify-center border-2 border-blue-500 text-3xl font-bold transition-all duration-200 ${isWinning ? 'border-green-500 bg-green-200' : 'hover:bg-blue-100'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <AnimatePresence mode="wait">
                {value && (
                    <motion.span
                        key={value}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {value}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

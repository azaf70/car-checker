import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
                origin: { y: 0.6 }
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
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100'>
            <div className='p-8 bg-white rounded-xl shadow-lg'>
                <h1 className='text-3xl font-bold text-center mb-8 text-blue-600'>Tic Tac Toe</h1>

                <div className='text-2xl text-center mb-4 text-gray-600'>{status}</div>

                <div className='grid grid-cols-3 gap-2 mb-4'>
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
                    className='w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Reset Game
                </motion.button>
            </div>
        </div>
    );
}

function Square({ value, onSquareClick, isWinning }: { value: string | null, onSquareClick: () => void, isWinning?: boolean }) {
    return (
        <motion.button
            onClick={onSquareClick}
            className={`border-2 border-blue-500 h-20 w-20 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-200 ${isWinning ? 'bg-green-200 border-green-500' : 'hover:bg-blue-100'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <AnimatePresence mode='wait'>
                {value && (
                    <motion.span
                        key={value}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {value}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
import { useState } from 'react';

export default function TicTacToe() {

    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));


    function handleClick(i: number) {
        const newSquares = squares.slice();
        if (squares[i] || calculateWinner(squares)) {
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

    const winner = calculateWinner(squares);
    let status;
    if (winner !== null && winner !== undefined) {
        status = 'Winner: ' + winner;
    } else if (squares.every((square) => square !== null)) {
        status = 'Draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    function calculateWinner(squares: string[]) {
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
                return squares[a];
            }
        }

        return null;
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100'>
            <div className='p-8 bg-white rounded-xl shadow-lg'>
                <h1 className='text-3xl font-bold text-center mb-8 text-blue-600'>Tic Tac Toe</h1>

                <div className='text-2xl text-center mb-4 text-gray-600'>{status}</div>

                <div className='grid grid-cols-3 gap-2'>
                    {squares.map((square, index) => (
                        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function Square({ value, onSquareClick }: { value: number, onSquareClick: () => void }) {
    return (
        <button
            onClick={onSquareClick}
            className='border-2 border-blue-500 h-20 w-20 flex items-center justify-center text-3xl font-bold hover:bg-blue-100 cursor-pointer transition-colors duration-200'
        >
            {value}
        </button>
    )
}
import { useState, useEffect } from "react";
import './App.css';
import Square from './components/Square';
import { Patterns } from './Patterns'
import WinnerScreen from "./WinnerScreen";
import { useSpring, animated } from "react-spring";

//game sounds initialize
const click = new Audio('./click.mp3')
const gameWinnerSound = new Audio('./win.wav')
const restartSound = new Audio('./restart.wav')

//game sound functions
const clickPlay = () => {
  click.play()
}
const gameWinner = () => {
  gameWinnerSound.play()
}
const gameRestart = () => {
  restartSound.play()
}



function App() {

  //box index
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  //player turn
  const [player, setPlayer] = useState('⭕');
  //result
  const [result, setResult] = useState({ winner: "none", state: "none" });
  //checkwin
  const [won, setWin] = useState(false);
  //score board
  const [score, setScore] = useState({ '⭕': 0, '❌': 0 });
  //button animation
  const [state, toggle] = useState(true);


  useEffect(() => {

    checkWin()
    checkIfTie()

    if (player === "❌") {
      setPlayer('⭕');
    } else {
      setPlayer("❌");
    }
  }, [board]);

  //render winner
  useEffect(() => {
    if (result.state !== "none") {
      setWin(true);
      gameWinner();
      // alert(`Game Finished! Winning Player: ${result.winner}`);
    }
  }, [result]);


  //handling click on box
  const handleClick = (square) => {
    clickPlay()
    setBoard(
      board.map((val, idx) => {
        if (idx === square && val === "") {
          return player;
        }
        return val;
      })
    );
  }

  //checking winners
  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: player, state: "Won" });
        setScore(prevScore => ({
          ...prevScore,
          [player]: prevScore[player] + 1
        }))
      }
    });
  };

  //restart
  const restartGame = () => {
    gameRestart()
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setPlayer('⭕');
    setWin(false)
  };

  //checking for tie
  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "No One", state: "Tie" });
    }
  };

  //reset scores
    const resetScores = () => {
      setScore({ '⭕': 0, '❌': 0 });
    };
    
  //button animation
    const { x } = useSpring({
      from: { x: 0 },
      x: state ? 1 : 0,
      config: { duration: 1000 },
    });

  return (
    <div className='App'>
      <div className='board'>
        <h1 className='title'>
          Let's Play <br /> Tic Tac T⭕e
        </h1>
        <div className='scoreboard'>
          Score:
          <span className={player === '⭕' ? 'current' : ''}>
            ⭕ {score['⭕']}
          </span>
          <span className={player === '❌' ? 'current' : ''}>
            ❌ {score['❌']}
          </span>
        </div>
        <div onClick={() => toggle(!state)}>
          <animated.div
            style={{
              scale: x.to({
                range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
              }),
            }}
          >
            <button className='reset-button' onClick={resetScores}>
              Reset Scores
            </button>
          </animated.div>
        </div>
        <div className='row'>
          <Square
            chooseSquare={() => {
              handleClick(0);
            }}
            val={board[0]}
          />
          <Square
            chooseSquare={() => {
              handleClick(1);
            }}
            val={board[1]}
          />
          <Square
            chooseSquare={() => {
              handleClick(2);
            }}
            val={board[2]}
          />
        </div>
        <div className='row'>
          <Square
            chooseSquare={() => {
              handleClick(3);
            }}
            val={board[3]}
          />
          <Square
            chooseSquare={() => {
              handleClick(4);
            }}
            val={board[4]}
          />
          <Square
            chooseSquare={() => {
              handleClick(5);
            }}
            val={board[5]}
          />
        </div>
        <div className='row'>
          <Square
            chooseSquare={() => {
              handleClick(6);
            }}
            val={board[6]}
          />
          <Square
            chooseSquare={() => {
              handleClick(7);
            }}
            val={board[7]}
          />
          <Square
            chooseSquare={() => {
              handleClick(8);
            }}
            val={board[8]}
          />
        </div>
      </div>
      {won ? (
        <WinnerScreen restartGame={restartGame} playerWon={result.winner} />
      ) : null}
    </div>
  );
}

export default App;

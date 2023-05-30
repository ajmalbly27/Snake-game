
import React, { useEffect, useRef, useState } from "react";
import Snake from './components/Snake';
import Food from './components/Food';
import './App.css';

const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
    let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
    return [x,y]
}

const App = () => {

    const [snakeDots, setSnakeDots] = useState([ [0,0],[2,0] ]);
    const [direction, setDirection] = useState('RIGHT');
    const [food, setFood] = useState(getRandomCoordinates());
    const [speed, setSpeed] = useState(200);
    const [status, setStatus] = useState(true);

    let intervalId = useRef();

    useEffect(() => {

        intervalId.current = setInterval(moveSnake, speed);
        document.onkeydown = onKeyDown;

        checkIfEat();
        checkIfOutOfBorders();
        checkIfCollapsed();

        return () => {
          clearInterval(intervalId.current);
        };
    }, [snakeDots]);

    const moveSnake = () => {

        let dots = [...snakeDots];
        let head = dots[dots.length - 1];

        switch(direction) {
            case 'LEFT':
                head = [head[0] - 2, head[1]];
                break;
            case 'RIGHT':
                head = [head[0] + 2, head[1]];
                break;
            case 'UP':
                head = [head[0], head[1] - 2];
                break;
            case 'DOWN':
                head = [head[0], head[1] + 2];
                break;
        }
        dots.push(head);
        dots.shift();
        setSnakeDots(dots);
    }

    const onKeyDown = (e) => {        
        switch(e.key) {
            case 'ArrowDown':
                setDirection('DOWN');
                break;
            case 'ArrowUp':
                setDirection('UP');
                break;
            case 'ArrowLeft':
                setDirection('LEFT');
                break;
            case 'ArrowRight':
                setDirection('RIGHT');
                break;
        }
    }

    const checkIfOutOfBorders = () => {
        let head = snakeDots[snakeDots.length - 1];
        if(head[0]<0 || head[0]>=100 || head[1]<0 || head[1]>=100){
            onGameOver();
        }
    }

    const checkIfCollapsed = () => {
        const newSnake = [...snakeDots];
        let head = newSnake[newSnake.length - 1];
        newSnake.pop();
        newSnake.forEach(dot => {
            if(head[0]===dot[0] && head[1]===dot[1]){
                onGameOver();
            }
        })
    }

    const checkIfEat = () => {
        let head = snakeDots[snakeDots.length - 1];
        if(head[0]===food[0] && head[1]===food[1]){
            setFood(getRandomCoordinates());
            increaseSpeed();
            enlargeSnake();
        }
    }

    const enlargeSnake = () => {
        let newSnake = [...snakeDots];
        newSnake.unshift([]);
        setSnakeDots(newSnake);
    }

    const increaseSpeed = () => {
        if(speed > 10){
            setSpeed(prevSpeed => prevSpeed - 10);
        }
    }

    const onGameOver = () => {
        alert(`Game Over: Your high score is: ${snakeDots.length*10}`);
        setSnakeDots([ [0,0],[2,0] ]);
        setDirection('RIGHT');
        setSpeed(200);
    }

    const handlePause = () => {
        clearInterval(intervalId.current);
        setStatus(false);
    }

    const handleResume = () => {
        intervalId.current = setInterval(moveSnake, speed);
        setStatus(true);
    }

    const handleRestart = () => {
        setSnakeDots([ [0,0],[2,0] ]);
        setDirection('RIGHT');
        setSpeed(200);
        setStatus(true);
    }

    return (
        <div className="container">
            <div>
              <div className="score">Score:{snakeDots.length*10}</div>
            </div>
            <div className="game-area">
                <Snake snakeDots={snakeDots}/>
                <Food dot={food}/>
            </div>
            <div>
                { status 
                    ? <button className="btn" onClick={() => handlePause()}>Pause</button> 
                    : <button className="btn" onClick={() => handleResume()}>Resume</button>
                }
                <button className="btn" onClick={() => handleRestart()}>Restart</button>
            </div>
        </div>
    )
}

export default App;
import './timer.css';
import { useState, useRef, useEffect } from "react";

export default function Timer() {

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [scramble, setScramble] = useState("");

    const timer = useRef();

    useEffect(() => {
        setScramble(createScramble());
    }, []);

    // handles key press events in the input box
    const handleKeyPress = (e) => {
        console.log(e.keyCode);

        if (e.keyCode == 32) {
            if (isRunning) {
                clearInterval(timer.current);

                setIsRunning(false);
            } else {
                // reset time to start at 0 every attempt
                setTime(0);

                // timer
                timer.current = setInterval(() => {
                    setTime(pre => pre + .01);
                }, 10)

                setIsRunning(true);
            }
        }
    };

    // formats the timer
    const format = (time) => {
        let hours = Math.floor(time / 60 / 60 % 24);
        let minutes = Math.floor(time / 60 % 60);
        let seconds = Math.floor(time % 60);
        let milliseconds = (time % 60 / 10).toFixed(3);
        
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = "" + milliseconds;
        milliseconds = milliseconds.substring(3,5);
    
        return minutes + ":" + seconds + "." + milliseconds;
    }

    return (
    <>
        <div className="container">
            {/* TITLE */}
            <div className="grid-item1">
                <h1>CC-Timer</h1>   
            </div>

            {/* DISPLAYS TIMES & STATS */}
            <div className="grid-item2">
                <h1>DISPLAY TIMES AND AVERAGES</h1>
            </div>

            {/* STOPWATCH & SCRAMBLE */}
            <div className="grid-item3">

                <div className="scramble">
                    <h1>{scramble}</h1>
                </div>

                <div className="stopwatch">
                    <input type="text" onKeyDown={handleKeyPress}></input>
                    <h1>{format(time)}</h1>
                </div>

            </div>

            {/* SETTINGS */}
            <div className="grid-item4">
                <h1>SETTINGS & STUFF</h1>
            </div>

            {/* FOOTER */}
            <div className="grid-item5">
                <p>Made using React.js</p>
            </div>
        </div>
    </>
    );
}


// function that randomly generates a rubik's cube scramble of length 25 with no repeating same-orientation moves
function createScramble() {
    console.log("Begin Creating Scramble")
    const possibleMoves = [ ["F", "F'", "F2"], ["B", "B'", "B2"], ["L", "L'", "L2"], ["R", "R'", "R2"], ["U", "U'", "U2"], ["D", "D'", "D2"] ];
    let scramble = "";
    let n = 0;
    let prevRowIndex = -1;

    while (n < 25) {
        let currRowIndex = Math.floor((Math.random() * 6));
        let currColIndex = Math.floor((Math.random() * 3));
        
        /*
            if currRowIndex is equal to prevRowIndex, move on like nothing happened so that no repeat orientation moves are possible
            if currRowIndex is NOT equal to prevRowIndex, then append to scramble
        */
        if (currRowIndex !== prevRowIndex) {
            scramble += "" + possibleMoves[currRowIndex][currColIndex] + " ";
            n++;
        }
        
        // always set the prevRowIndex
        prevRowIndex = currRowIndex;
    }

    return scramble;
}


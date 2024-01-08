import './timer.css';
import { useState, useRef, useEffect } from "react";

function SingleTime() {
    return (
        <>
        <tr>
            <td>1</td>
        </tr>
        </>
    );
}

export default function Timer() {

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [scramble, setScramble] = useState("");
    const [history, setHistory] = useState([]);
    const [averageFive, setAverageFive] = useState(0);

    const timer = useRef();

    useEffect(() => {
        setScramble(createScramble());
    }, []);

    // handles key press events in the input box
    const handleKeyPress = (e) => {

        if (e.keyCode == 32) {
            if (isRunning) {
                console.log(history);
                // stops timer
                clearInterval(timer.current);
                // adds current time to array
                let attempt = document.getElementById("stopwatch-time").innerHTML;
                let nextHistory = [...history, attempt];
                setHistory(nextHistory);
                console.log(history)
                // timer state is no longer running
                setIsRunning(false);
                // get and update average of 5
                setAverageFive(updateAO5());
            } else {
                console.log("start: " + history)
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
        let minutes = Math.floor(time / 60 % 60);
        let seconds = Math.floor(time % 60);
        let milliseconds = (time % 60 / 10).toFixed(3);
        
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = "" + milliseconds;
        milliseconds = milliseconds.substring(3,5);
    
        return minutes + ":" + seconds + "." + milliseconds;
    }

    function updateAO5() {
        // ALL TIMES ARE STORED AS STRINGS, SO THEY FIRST NEED TO BE PARSED TO INTS, SO THE RESULT ISNT NaN
        console.log(history);
        let min = history[0];
        let max = history[0];
        let sum = 0;
        for (let i = 0; i < history.length; i++) {
            if (history[i] < min) {
                min = history[i];
            }
            if (history[i] > max) {
                max = history[i];
            }
            sum += history[i];
        }

        sum = sum - (max + min);
        sum = sum / 3;
        console.log(sum);
        return sum;
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
                <div className="statistics">
                    <p>Ao5: { averageFive }</p>
                    <p>Ao12: </p>
                    <p>Ao100: </p>
                    <p>Session Avg: </p>
                    <p>Best Time: </p>
                </div>

                <div className="times-table">
                    <table className="times-table-list">
                        <SingleTime></SingleTime>
                        <SingleTime></SingleTime>
                        
                    </table>
                </div>
            </div>

            {/* STOPWATCH & SCRAMBLE */}
            <div className="grid-item3">

                <div className="scramble">
                    <h1>{scramble}</h1>
                </div>

                <div className="stopwatch">
                    <input type="text" onKeyDown={handleKeyPress}></input>
                    <h1 id="stopwatch-time" >{format(time)}</h1>
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


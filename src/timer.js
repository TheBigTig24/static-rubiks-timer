import './timer.css';
import { useState, useRef, useEffect } from "react";

export default function Timer() {

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [scramble, setScramble] = useState("");
    const [history, setHistory] = useState([]);
    const [averageFive, setAverageFive] = useState(0);
    const [averageTwelve, setAverageTwelve] = useState(0);
    const [averageHundred, setAverageHundred] = useState(0);
    const [sessionAvg, setSessionAvg] = useState(0);
    const [pb, setPB] = useState(0);

    const timer = useRef();
    const isRunningV2 = useRef(0);

    useEffect(() => {
        setScramble(createScramble());
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
          };
    }, []);

    useEffect(() => {
        setAverageFive(updateAO5());
        setAverageTwelve(updateAO12());
        setAverageHundred(updateAO100());
        setSessionAvg(updateSA());
        setPB(updatePB());
    }, [history]);

    useEffect(() => {
        console.log("IS RUNNING UseEFFECT " + isRunning + " " + isRunningV2.current);
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
          };
    }, [isRunning]);

    // handles key press events in the input box
    const handleKeyPress = (e) => {
        console.log("Handling");
        console.log("Before If statement: " + isRunning + " " + isRunningV2.current);
        if (e.keyCode == 32) {
            if (isRunning) {
                console.log("Stopping");
                // stops timer
                clearInterval(timer.current);
                // adds current time to array
                let attempt = document.getElementById("stopwatch-time").innerHTML;
                let nextHistory = [...history, attempt];
                setHistory(nextHistory);
                // timer state is no longer running
                setIsRunning(false);
                setScramble(createScramble());
            } else {
                console.log("Running");
                // reset time to start at 0 every attempt
                setTime(0);

                // timer
                timer.current = setInterval(() => {
                    setTime(pre => pre + .01);
                }, 10)

                setIsRunning(true);
                isRunningV2.current = 1;
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
    const addTwoSeconds = () => {
        let latestSolveIndex = history.length - 1;
        let asInt = getTimeAsInt(latestSolveIndex);
        asInt += 2;
        let backToString = switchTimeToString(asInt);
        history[latestSolveIndex] = backToString;
    }
    const removeSingle = () => {
        let latestSolveIndex = history.length - 1;
        history.splice(latestSolveIndex, 1);
    }
    const clearAll = () => {
        history.splice(0, history.length);
    }
    // calculates average of 5
    function updateAO5() {
        let min = getTimeAsInt(0);
        let max = getTimeAsInt(0);
        let sum = 0;
        for (let i = Math.max(0, history.length - 5); i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / 3;
        sum = sum.toFixed(3);

        if (history.length < 5) {
            return "-Less than 5 solves-";
        } else {
            return sum;
        }
    }
    // calculates average of 12
    function updateAO12() {
        let min = getTimeAsInt(0);
        let max = getTimeAsInt(0);
        let sum = 0;
        for (let i = Math.max(0, history.length - 12); i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / 10;
        sum = sum.toFixed(3);

        if (history.length < 12) {
            return "-Less than 12 solves-";
        } else {
            return sum;
        }
    }
    // calculates average of 100
    function updateAO100() {
        let min = getTimeAsInt(0);
        let max = getTimeAsInt(0);
        let sum = 0;
        for (let i = Math.max(0, history.length - 100); i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / 98;
        sum = sum.toFixed(3);

        if (history.length < 100) {
            return "-Less than 100 solves-";
        } else {
            return sum;
        }
    }
    // calculates session average
    function updateSA() {
        let min = getTimeAsInt(0);
        let max = getTimeAsInt(0);
        let sum = 0;
        for (let i = 0; i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
            if (indexTime > max) {
                max = indexTime;
            }
            sum += indexTime;
        }

        sum = sum - (max + min);
        sum = sum / (history.length - 2);
        sum = sum.toFixed(3);

        if (history.length < 3) {
            return "-Min. 3 Solves-";
        } else {
            return sum;
        }
    }
    // calculates best time
    function updatePB() {
        let min = getTimeAsInt(0);
        for (let i = 0; i < history.length; i++) {
            let indexTime = getTimeAsInt(i);
            if (indexTime < min) {
                min = indexTime;
            }
        }
        if (history.length < 1) {
            return "-No Solves-"
        }
        return min;
    }

    //parses time to int given an index of the history array
    function getTimeAsInt(index) {
        const time = "" + history[index];

        const minutesStr = time.substring(0, 2);
        const secondsStr = time.substring(3, 5);
        const msStr = time.substring(6);

        const minutes = parseInt(minutesStr);
        const seconds = parseInt(secondsStr);
        const ms = parseInt(msStr);

        const timeInSec = (minutes * 60) + seconds + (ms / 100);

        return timeInSec;
    }
    function switchTimeToString(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        let milliseconds = (time % 60).toFixed(5) / 100;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = "" + milliseconds;
        milliseconds = milliseconds.substring(4,6);

        return minutes + ":" + seconds + "." + milliseconds;
    }

    const timesTable = history.map((time) => {
        let indexOfTime = history.indexOf(time);
        return (
            <tr>
                <td id="solve-number" > { indexOfTime + 1} </td>
                <td id="solve-time" > { time } </td>
            </tr>
        )
    });
        

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
                    <p>Ao12: { averageTwelve }</p>
                    <p>Ao100: { averageHundred }</p>
                    <p>Session Avg: { sessionAvg }</p>
                    <p>Best Time: { pb }</p>
                </div>

                <div className="times-table">
                    <table className="times-table-list">
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                        </tr>
                        { timesTable }
                    </table>
                </div>
            </div>

            {/* STOPWATCH & SCRAMBLE */}
            <div className="grid-item3">

                <div className="scramble">
                    <h1>{scramble}</h1>
                </div>

                <div className="stopwatch">
                    <h1 id="stopwatch-time" >{format(time)}</h1>
                </div>

            </div>

            {/* SETTINGS */}
            <div className="grid-item4">
                <button class="button" onClick={addTwoSeconds}><h1>+2</h1></button>
                <button class="button" onClick={removeSingle}><h1>Delete Single</h1></button>
                <button class="button" onClick={clearAll}><h1>Clear All</h1></button>
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


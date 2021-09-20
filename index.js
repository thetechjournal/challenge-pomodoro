const timerDisplay = document.querySelector("#time-display");
const btnStart = document.querySelector("#btn-start");
const btnPause = document.querySelector("#btn-pause");
const btnStop = document.querySelector("#btn-stop");
const message = document.querySelector("#status-message");

let isClockRunning = false;
// work time in seconds
let workingSessionDuration = 25 * 60; //25*60
// Short break time in seconds
let shortBreakSessionDuration = 5 * 60; //5*60
// Long break time in seconds
let longBreakSessionDuration = 15 * 60; //15*60
let runningDurationLeftInSession = 25 * 60;
let clockTimer;
let pomodoroSessionCounter = 0;

let activityType = "work";

// add leading zeroes if time is less than 10
const pad = (number) => {
  return number < 10 ? `0${number.toString()}` : number;
};

const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = runningDurationLeftInSession;
  let result = "";
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  if (hours > 0) result += `${hours}:`;
  result += `${pad(minutes)}:${pad(seconds)}`;
  timerDisplay.innerText = result;
};

const stopClock = () => {
  clearInterval(clockTimer);
  isClockRunning = false;
  // reset the time left in the session to its original state
  runningDurationLeftInSession = workingSessionDuration;
  // update the timer displayed
  displayCurrentTimeLeftInSession();
  // activityType = activityType === 'work' ? 'break' : 'work'
};

const countDown = () => {
  if (runningDurationLeftInSession > 0) {
    runningDurationLeftInSession--;
  } else if (runningDurationLeftInSession === 0) {
    if (activityType === "work") {
      pomodoroSessionCounter++;
      if (pomodoroSessionCounter === 4) {
        message.innerText = "Time for a long break";
        new Audio("./sounds/ringer.mp3").play();
        runningDurationLeftInSession = longBreakSessionDuration;
        clearInterval(clockTimer);
      } else {
        message.innerText = "Time for a short break";
        new Audio("./sounds/ringer.mp3").play();
        runningDurationLeftInSession = shortBreakSessionDuration;
        clearInterval(clockTimer);
      }
      displaySessionLog("work");
      activityType = "break";
    } else {
      message.innerText = "Keep working...";
      runningDurationLeftInSession = workingSessionDuration;
      activityType = "work";
      new Audio("./sounds/ringer.mp3").play();
      clearInterval(clockTimer);
    }
  }
};

const toggleClock = (reset) => {
  if (reset) {
    stopClock();
  } else {
    if (isClockRunning === true) {
      // Pause the timer
      clearInterval(clockTimer);
      isClockRunning = false;
    } else {
      // Start the timer
      isClockRunning = true;
      clockTimer = setInterval(() => {
        countDown();
        displayCurrentTimeLeftInSession();
      }, 1000);
    }
  }
};

btnStart.addEventListener("click", () => {
  toggleClock();
});
btnPause.addEventListener("click", () => {
  toggleClock();
});
btnStop.addEventListener("click", () => {
  toggleClock(true);
});

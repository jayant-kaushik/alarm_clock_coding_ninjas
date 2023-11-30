// Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const amPmSelect = document.getElementById("amPmSelect");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

// Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  // Convert hours to 12-hour format
  let amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // Display time
  timerRef.innerHTML = `${hours}:${minutes}:${seconds} ${amPm}`;

  // Alarm
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      let alarmHour = parseInt(alarm.alarmHour);
      let alarmMinute = parseInt(alarm.alarmMinute);

      // Convert alarm hour to 24-hour format if necessary
      if (alarm.amPm === "PM" && alarmHour !== 12) {
        alarmHour += 12;
      } else if (alarm.amPm === "AM" && alarmHour === 12) {
        alarmHour = 0;
      }

      if (
        alarmHour === date.getHours() &&
        alarmMinute === date.getMinutes() &&
        seconds === "00"
      ) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

// Convert single digit value of hours, minutes and seconds to double digits

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

// Create alarm div
const createAlarm = (alarmObj) => {
  // Keys from object
  const { id, alarmHour, alarmMinute, amPm } = alarmObj;

  // Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute} ${amPm}</span>`;

  // Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);

  activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  // Alarm Object
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.amPm = amPmSelect.value;
  alarmObj.isActive = false;
  console.log(alarmObj);

  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
});

// Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

// Stop Alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    if (alarmSound) {
      alarmSound.pause();
    }
  }
};

// Delete Alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};
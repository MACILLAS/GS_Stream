'use strict'; 

//var socket = io();
var socket = io.connect(null, {port: 5000, rememberTransport: false});
socket.on('connect', function(){
    socket.emit('my_event', {data: 'I\'m connected!'});
});

// Get the canvas and button elements
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img1 = new Image()

const drawButton = document.getElementById('drawButton');

// listen for img1
socket.on('img1', function(msg) {
        console.log("Get Image!")
        let arrayBufferView = new Uint8Array(msg['image']);
        console.log(arrayBufferView);

        var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        var img1_url = URL.createObjectURL(blob);
        console.log(img1_url);
        img1.onload = function () {
            canvas.height = img1.height;
            canvas.width = img1.width;
            ctx.drawImage(img1, 0, 0);
        }
        img1.src = img1_url
});

// Step
let step = 1;

const stepValue = document.getElementById('stepValue');
const message = document.getElementById('message');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');

increase.addEventListener('click', function() {
    if (step < 10) {
        step++;
        stepValue.value = step;
        message.textContent = '';
    } else {
        message.textContent = 'The value cannot exceed 10.';
    }
});

decrease.addEventListener('click', function() {
    if (step > 1) {
        step--;
        stepValue.value = step;
        message.textContent = '';
    } else {
        message.textContent = 'The value cannot be less than 1.';
    }
});

stepValue.addEventListener('input', function() {
    const inputValue = parseInt(this.value, 10);
    if (inputValue >= 1 && inputValue <= 10) {
        step = inputValue;
        message.textContent = '';
    } else {
        message.textContent = 'Value must be between 1 and 10.';
    }
});

// FPS limit
let lastKeyPressedTime = 0;
window.addEventListener("keypress", keyEventHandler, false);
function keyEventHandler(event){
       const currentTime = new Date().getTime();
       if (currentTime - lastKeyPressedTime > 100) { // 100ms = 0.1 second
           lastKeyPressedTime = currentTime;
           socket.emit("key_control", {key: event.key, step: step})
        console.log(event.key);
       } else {
          console.log("Too many requests!");
       }
}

// Pose Reset
const reset = document.getElementById('reset');
reset.addEventListener('click', function() {
    console.log("pose_reset")
    socket.emit("pose_reset")
})

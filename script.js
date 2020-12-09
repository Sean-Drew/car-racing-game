// Set some constant variables to be used
const speedDash = document.querySelector('.speedDash')
const scoreDash = document.querySelector('.scoreDash')
const lifeDash = document.querySelector('.lifeDash')
const container = document.getElementById('container')
const btnStart = document.querySelector('.btnStart')

// Set up some event listeners to handle gameplay mechanics
btnStart.addEventListener('click', startGame)
document.addEventListener('keydown', pressKeyOn)
document.addEventListener('keyup', pressKeyOff)

// Game Variables
let animationGame = requestAnimationFrame(playGame)
let gamePlay = false
let player

// Set the input keys available to the user & explicitly default to false
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

// This function controls starting a game - creates UI elements + a player object & associated variables.
function startGame() {
    console.log(gamePlay)
    btnStart.style.display = 'none'
    let div = document.createElement('div')
    div.setAttribute('class', 'playerCar')
    div.x = 250
    div.y = 500
    container.appendChild(div)
    
    gamePlay = true
    animationGame = requestAnimationFrame(playGame)
    
    player = {
        ele: div,
        speed: 1,
        lives: 3,
        gameScore: 0,
        carsToPass: 10,
        score: 0,
        roadWidth: 250
    }
    startBoard()
}

function startBoard() {
    for (let x = 0; x < 13; x++) {
        let div = document.createElement('div')
        div.setAttribute('class', 'road')
        div.style.top = (x * 50) + 'px'
        div.style.width = player.roadWidth + 'px'
        container.appendChild(div)
    }
}

function pressKeyOn(event) {
    event.preventDefault()
    keys[event.key] = true
    console.log('Keys from On: ', keys)
}

function pressKeyOff(event) {
    event.preventDefault()
    keys[event.key] = false
    console.log('Keys from Off: ', keys)
}

function updateDash() {
    // console.log(player)
    scoreDash.innerHTML = player.score
    lifeDash.innerHTML = player.lives
    speedDash.innerHTML = Math.round(player.speed * 5)
}

function playGame(){
    if(gamePlay){
        // update the game dashboard
        updateDash()

        // assign values to element position, to move the car
        if (keys.ArrowUp) {
            console.log('player.ele.y is: ', player.ele.y)
            player.ele.y -= 1
            player.speed = player.speed < 20? (player.speed + 0.05) : 20
        }
        if (keys.ArrowDown) {
            console.log('player.ele.y is: ', player.ele.y)
            player.ele.y += 1
            player.speed = player.speed > 0? (player.speed - 0.05) : 0
        }
        if (keys.ArrowRight) {
            console.log('player.ele.x is: ', player.ele.x)
            player.ele.x += (player.speed / 4)
        }
        if (keys.ArrowLeft) {
            console.log('player.ele.x is: ', player.ele.x)
            player.ele.x -= (player.speed / 4)
        }

        // actually move the car icon
        player.ele.style.top = player.ele.y + 'px'
        player.ele.style.left = player.ele.x + 'px'
    }

    animationGame = requestAnimationFrame(playGame)
}

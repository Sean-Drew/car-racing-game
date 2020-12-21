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
    // console.log(gamePlay)
    container.innerHTML = ''
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
        speed: 0,
        lives: 3,
        gameScore: 0,
        carsToPass: 8,
        score: 0,
        roadWidth: 250,
        gameEndCounter: 0
    }
    startBoard()
    setupBadGuys(10)
}

function setupBadGuys(num) {
    for (let x = 0; x < num; x++) {
        let temp = `badGuy ${x + 1}`
        let div = document.createElement('div')
        div.innerHTML = (x + 1)
        div.setAttribute('class', 'baddy')
        div.setAttribute('id', temp)
        makeBad(div)
        container.appendChild(div)
    }
}

// Assign random color to NPC cars
function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16)
        return(`0${String(hex)}`).substr(-2)
    }
    return '#' + c() + c() + c()
}

function makeBad(element) {
    let tempRoad = document.querySelector('.road')
    element.style.left = tempRoad.offsetLeft + Math.ceil(Math.random() * tempRoad.offsetWidth) - 30 + 'px'
    element.style.top = `${Math.ceil(Math.random() * (-400))}px`
    element.speed = Math.ceil(Math.random() * 17) + 2
    element.style.backgroundColor = randomColor()
}

function startBoard() {
    for (let x = 0; x < 13; x++) {
        let div = document.createElement('div')
        div.setAttribute('class', 'road')
        div.style.top = `${x * 50}px`
        div.style.width = `${player.roadWidth}px`
        container.appendChild(div)
    }
}

function pressKeyOn(event) {
    event.preventDefault()
    keys[event.key] = true
    // console.log('Keys from On: ', keys)
}

function pressKeyOff(event) {
    event.preventDefault()
    keys[event.key] = false
    // console.log('Keys from Off: ', keys)
}

function updateDash() {
    // console.log(player)
    scoreDash.innerHTML = player.score
    lifeDash.innerHTML = player.lives
    speedDash.innerHTML = Math.round(player.speed * 13)
}

function moveRoad() {
    let tempRoad = document.querySelectorAll('.road')
    // console.log(tempRoad)
    let previousRoad = tempRoad[0].offsetLeft
    let previousWidth = tempRoad[0].offsetWidth
    let pSpeed = Math.floor(player.speed)
    for (let x = 0; x < tempRoad.length; x++) {
        let num = tempRoad[x].offsetTop + pSpeed
        if (num > 600) {
            num = num - 650
            let mover = previousRoad + (Math.floor(Math.random() * 6) - 3)
            let roadWidth = (Math.floor(Math.random() * 11) - 5) + previousWidth
            if (roadWidth < 200) roadWidth = 200
            if (roadWidth > 400) roadWidth = 400
            if (mover < 100) mover = 100
            if (mover > 600) mover = 600
            tempRoad[x].style.left = `${mover}px`
            tempRoad[x].style.width = `${roadWidth}px`
            previousRoad = tempRoad[x].offsetLeft
            previousWidth = tempRoad[x].width
        }
        tempRoad[x].style.top = `${num}px`
    }
    return {
        'width' : previousWidth,
        'left' : previousRoad
    }
}

// Collision detection between player car & NPC cars
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect()
    let bRect = b.getBoundingClientRect()
    // console.log('aRect is: ', aRect)
    // console.log('bRect is: ', bRect)
    const boundaryCheck = (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) ||(aRect.left > bRect.right)
    return !boundaryCheck
}

function moveBadGuys() {
    let tempBaddy = document.querySelectorAll('.baddy')
    for (let i = 0; i < tempBaddy.length; i++) {
        for (let ii = 0; ii < tempBaddy.length; ii++) {
            if (i != ii && isCollide(tempBaddy[i], tempBaddy[ii])) {
                tempBaddy[ii].style.top = `${tempBaddy[ii].offsetTop + 20}px`
                tempBaddy[i].style.top = `${tempBaddy[i].offsetTop - 20}px`
                tempBaddy[ii].style.left = `${tempBaddy[ii].offsetLeft - 20}px`
                tempBaddy[i].style.left = `${tempBaddy[i].offsetLeft + 20}px`
            }
        }

        let y = tempBaddy[i].offsetTop + player.speed - tempBaddy[i].speed
        if (y > 2000 || y < -2000) {
            if (y > 2000) {
                player.score ++
                if (player.score > player.carsToPass) {
                    gameOverPlay()
                }
            }
            // reset NPC position if it spawns 'out of bounds'
            makeBad(tempBaddy[i])
        }
        else {
            tempBaddy[i].style.top = `${y}px`
            let hitCar = isCollide(tempBaddy[i], player.ele)
            // console.log(hitCar)
            if (hitCar) {
                player.speed = 0
                player.lives --
                if (player.lives < 1) {
                    player.gameEndCounter = 1
                }
                makeBad(tempBaddy[i])
            }
        }
    }
}

function gameOverPlay() {
    let div = document.createElement('div')
    div.setAttribute('class', 'road')
    div.style.top = '0px'
    div.style.width = '250px'
    div.style.backgroundColor = 'red'
    div.innerHTML = 'FINISH'
    div.style.fontSize = '3em'
    container.appendChild(div)
    player.gameEndCounter = 12
}

function playGame() {      
    if(gamePlay) {
        // Update the game dashboard
        updateDash()
        // Road movement
        let roadParams = moveRoad()
        // Move NPC cars
        moveBadGuys()

        // Assign values to element position, to move the car
        if (keys.ArrowUp) {
            // console.log('player.ele.y is: ', player.ele.y)
            if (player.ele.y > 350) 
            player.ele.y -= 1
            player.speed = player.speed < 20? (player.speed + 0.05) : 20
        }
        if (keys.ArrowDown) {
            // console.log('player.ele.y is: ', player.ele.y)
            if (player.ele.y < 500)
            player.ele.y += 1
            player.speed = player.speed > 0? (player.speed - 0.05) : 0
        }
        if (keys.ArrowRight) {
            // console.log('player.ele.x is: ', player.ele.x)
            player.ele.x += (player.speed / 4)
        }
        if (keys.ArrowLeft) {
            // console.log('player.ele.x is: ', player.ele.x)
            player.ele.x -= (player.speed / 4)
        }

        // Check if car on road, reduce speed if offroad
        if ((player.ele.x + 40) < roadParams.left || (player.ele.x > (roadParams.left + roadParams.width))) {
            if (player.ele.y < 500) {
                player.ele.y += 1
            }
            player.speed = player.speed > 0 ? (player.speed - 0.2) : 1
            // console.log('Off Road')
        }

        // Actually move the car icon
        player.ele.style.top = `${player.ele.y}px`
        player.ele.style.left = `${player.ele.x}px`
    }

    animationGame = requestAnimationFrame(playGame)
    
    if (player.gameEndCounter > 0) {
        player.gameEndCounter --
        player.y = (player.y > 60) ? player.y - 30 : 60
        if (player.gameEndCounter === 0) {
            gamePlay = false
            cancelAnimationFrame(animationGame)
            btnStart.style.display = 'block'
        }
    }
}

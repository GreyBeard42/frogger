let size, game, frog
let font
let images = []
let sounds = {}

function preload() {
    font = loadFont("frogger.ttf")
    for(i=0; i<34; i++) images.push(loadImage("images/frog_"+i+".png"))

    sounds.main = loadSound("sounds/main.mp3")
    sounds.hop = loadSound("sounds/hop.mp3")
    sounds.respawn = loadSound("sounds/respawn.mp3")
    sounds.over = loadSound("sounds/over.mp3")
}

function setup() {
    size = round(windowWidth/35)
    let cnvs = createCanvas(size*14, size*14)
    cnvs.parent('canvas')
    imageMode(CENTER)
    angleMode(DEGREES)
    noSmooth()
    textFont(font)

    game = new Game()
    frog = new Frog(size*7, size*12)
}

function draw() {
    background(0)
    translate(size/2, size/2+size/4)
    fill("#1c2794")
    rect(0-size/2, 0-size, width, size*7)

    frog.controls()

    //collisions
    game.cars.forEach((c) => {
        if(frog.collision(c)) {
            frog.die()
        }
    })

    game.truck.forEach((t) => {
        if(frog.collision(t)) {
            frog.die()
        }
    })

    if(frog.collision(game.bug)) {
        game.bugTimer = random(10, 20)
        game.score += 200
    }

    if(frog.y < size*5.5 && frog.y > size) {
        frog.v = frog.onLog()
        if(frog.v == 0) frog.die()
    } else frog.v = 0


    //time
    if(frameCount%10 == 0) game.time = round((game.time-0.1)*10)/10

    //show
    game.build()
    frog.draw()

    if(game.frogs == 0) {
        sounds.main.stop()
        sounds.respawn.stop()
        sounds.over.play()
        draw = () => {
            fill('white')
            textSize(size/2)
            textAlign(CENTER)
            text("GAME OVER", size*7, size*8)
        }
    }
}
class Game {
    constructor() {
        this.frogs = 6
        this.score = 0
        this.level = 1
        this.speed = width/550
        this.time = 60

        //key down prev frame
        this.kdpf = false

        this.canSound = false

        this.cars = []
        this.cars.push(new Thing(16, size*9, size*11, -this.speed))
        this.cars.push(new Thing(16, size*5, size*11, -this.speed))
        this.cars.push(new Thing(16, size*1, size*11, -this.speed))
        this.cars.push(new Thing(19, size*11, size*10, this.speed))
        this.cars.push(new Thing(19, size*7, size*10, this.speed))
        this.cars.push(new Thing(19, size*3, size*10, this.speed))
        this.cars.push(new Thing(17, size*9, size*9, -this.speed))
        this.cars.push(new Thing(17, size*5, size*9, -this.speed))
        this.cars.push(new Thing(17, size*1, size*9, -this.speed))
        this.cars.push(new Thing(18, size*7, size*8, this.speed*2))

        this.truck = []
        this.truck.push(new Thing(20, 0, size*7, -this.speed))
        this.truck.push(new Thing(21, size, size*7, -this.speed))
        
        this.bug = new Thing(15, 0, 0)
        this.bug.spot = round(random(0, 4))
        this.bugTimer = random(10, 20)

        this.logs = [[[], [], []], [[], [], []], [[], []], [[], [], [], []], [[], [], []]]
        let logs = [
            [
                {i: 27, s: -40},
                {i: 27, s: -40},
                {i: 27, s: -40}
            ],
            [
                {i: 4, s: 70},
                {i: 5, s: 70},
                {i: 6, s: 70}
            ],
            [
                {i: 4, s: 22},
                {i: 5, s: 22},
                {i: 5, s: 22},
                {i: 5, s: 22},
                {i: 6, s: 22}
            ],
            [
                {i: 27, s: -40},
                {i: 27, s: -40}
            ],
            [
                {i: 4, s: 40},
                {i: 5, s: 40},
                {i: 6, s: 40}
            ]
        ]
        let iy = 0
        for(let y=0; y<5; y++) {
            let temp = 3
            if(iy == 2) temp = 2
            else if(iy == 3) temp = 4
            for(let x=0; x<temp; x++) {
                let i = 0
                logs[iy].forEach((l) => {
                    let gap = 5
                    if(iy == 2) gap = 9
                    this.logs[y][x][i] = new Thing(l.i, size*(i+x*gap), size*(5-y), size/l.s)
                    i++
                })
            }
            iy++
        }
    }
    build() {
        textSize(size/3)
        textAlign(LEFT, CENTER)
        fill('white')
        text("1-UP:"+scorify(game.score), -size/2, height-size*1.15)

        fill("#bfc2f2")
        textAlign(CENTER, CENTER)
        text("FROGS:"+this.frogs, width/2, height-size*1.15)

        fill("yellow")
        textAlign(RIGHT, CENTER)
        text("TIME", width-size*0.75, height-size*1.15)

        //purple grass
        for(i=0; i<size; i++) {
            image(images[3], i*size, size*6, size, size)
            image(images[3], i*size, size*12, size, size)
        }

        //green grass
        push()
        translate(0, -size/2)
        for(i=0; i<5; i++) {
            image(images[7], 0, 0, size, size)
            image(images[8], size*0.5, 0, size, size)
            image(images[9], 0, size*0.5, size, size)
            image(images[10], 0, size, size, size)
            image(images[8], size*1, size*0, size, size)
            image(images[11], size*1.5, size*0, size, size)
            image(images[12], size*1.5, size*0.5, size, size)
            image(images[13], size*1.5, size*1, size, size)
            image(images[14], size*2, size*0, size, size)
            image(images[14], size*2, size*0.5, size, size)
            image(images[8], size*2, size*1, size, size)
            image(images[14], size*2.5, size*0, size, size)
            image(images[14], size*2.5, size*0.5, size, size)
            image(images[8], size*2.5, size*1, size, size)
            translate(3*size, 0)
        }
        pop()

        //bug
        if(this.bugTimer <= 0) {
            this.bug.x = size*(this.bug.spot*3)+size/2
            this.bug.draw()
        } else {
            this.bug.x = -width
        }
        if(frameCount%60 == 0) {
            if(round(this.bugTimer) == 1) this.bug.spot = round(random(0, 4))
            this.bugTimer -= 1 
        }
        if(this.bugTimer < -5) {
            this.bugTimer = random(10, 20)
        }

        //logs
        this.logs.forEach((y) => {
            y.forEach((x) => {
                x.forEach((l) => {
                    if(frameCount%round(abs(l.v*15)) == 0)
                    if(l.y/size == 5 || l.y/size == 2) {
                        if(l.img < 29) l.img++
                        else l.img = 27
                    }
                    l.draw()
                })
            })
        })

        this.cars.forEach((c) => {c.draw()})
        this.truck.forEach((t) => {t.draw()})

        this.sounds()
    }
    sounds() {
        if(this.canSound) {
            if(!sounds.main.isPlaying() && !sounds.respawn.isPlaying()) sounds.main.play()
        } else {
            if(keyIsPressed || mouseIsPressed) this.canSound = true
        }
    }
}

class Thing {
    constructor(img, x, y, v=0, width=size, height=size) {
        this.img = img
        this.x = x
        this.y = y
        this.v = v
        this.w = width
        this.h = height
    }
    draw() {
        image(images[this.img], floor(this.x), floor(this.y), this.w+2, this.h)
        this.x += this.v
        if(this.x > width+this.w && this.v > 0) this.x = -this.w
        if(this.x < -this.w && this.v < 0) this.x = width+this.w
    }
}

function scorify(txt) {
    let num = 6-JSON.stringify(txt).length
    for(i=0; i<num; i++) {
        txt = "0"+txt
    }
    return(txt)
}
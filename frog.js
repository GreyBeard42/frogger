class Frog {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.dir = 0
        this.frame = 0
        this.v = 0
        this.tx = x
        this.ty = y
        this.moving = false

        this.retreats = 0
    }
    draw() {
        push()
        translate(this.x, this.y)
        rotate(this.dir*90)
        image(images[this.frame], 0, 0, size, size)
        pop()

        if(this.frame > 4) {
            this.dir = 0
            if(this.frame == 34 && frameCount%60 == 20) {
                frog = new Frog(size*7, size*12)
                game.frogs--
                sounds.respawn.play()
            }
            if(frameCount%10 == 5) {
                if(this.frame != 34) this.frame++
                if(this.frame == 33 || this.frame == 26) this.frame = 34
            }
        } else {
            this.x += (this.tx-this.x)/3
            this.x += this.v
            this.tx += this.v
            this.y += (this.ty-this.y)/3
            if(abs(this.tx-this.x) > 0.2 || abs(this.ty-this.y) > 0.2) {
                this.moving = true
                this.frame = 1
            } else {
                this.moving = false
                this.frame = 0
            }

            if(this.y < size) {
                let temp = this.topSpot()
                if(temp) {
                    this.x = temp
                    this.frame = 30
                    this.dir = 0
                    sounds.safe.play()
                    game.addTopFrog(temp)
                    frog = new Frog(size*7, size*12)
                    game.score += 50
                    game.time = 30
                } else {
                    this.die(sounds.dieWater)
                }
            }
        }
    }
    controls() {
        if(!game.kdpf) {
            let move = true
            if((keyIsDown(39) || keyIsDown(68)) && this.x < width-size*2) {
                this.tx = this.x+size
                this.dir = 1
            } else if((keyIsDown(37) || keyIsDown(65)) && this.x > size*0.7) {
                this.tx = this.x-size
                this.dir = 3
            } else if((keyIsDown(38) || keyIsDown(87)) && this.y > size) {
                this.ty = this.y-size
                this.dir = 0
                if(this.retreats == 0) game.score += 10
                else this.retreats--
            } else if((keyIsDown(40) || keyIsDown(83)) && this.y < height-size*2) {
                this.ty = this.y+size
                this.dir = 2
                this.retreats++
            } else {
                this.frame = 0
                move = false
            }
            if(move) sounds.hop.play()
        }

        if(this.x > width+size/3 && this.v != 0) this.die(sounds.dieRoad)
        if(this.x < -size && this.v != 0) this.die(sounds.dieRoad)
        
        if(keyIsPressed) game.kdpf = true
        else game.kdpf = false
    }
    die(s) {
        game.time = 30
        sounds.main.stop()
        s.play()
        if(s == sounds.dieRoad) this.frame = 31
        if(s == sounds.dieWater) this.frame = 22
    }
    collision(other) {
        if(abs(other.y-round(this.y)) < size/4) {
            if(abs(other.x-round(this.x)) < size) {
                return(true)
            }
        }
        return(false)
    }
    onLog() {
        let output = 0
        game.logs.forEach((y) => {
            y.forEach((x) => {
                x.forEach((l) => {
                    //if(l.y-size/2 < this.y+size/2 && l.y+size/2 > this.y-size/2) {
                    if(abs(l.y-round(this.y)) < size*0.7) {
                        //if(l.x-size/3 < this.x+size/3 && l.x+size/3 > this.x-size/3) {
                        if(abs(l.x-round(this.x)) <= size*0.7) {
                            output = l.v
                        }
                    }
                })
            })
        })
        return output
    }
    topSpot() {
        //I'm not the greatest; I couldn't figure out an equation for this
        let temp
        if(this.x < size*1.25) temp = size*0.5
        if(this.x > size*2.75 && this.x < size*4) temp = size*3.5
        if(this.x > size*5.5 && this.x < size*7.25) temp = size*6.5
        if(this.x > size*8.25 && this.x < size*9.75) temp = size*9.5
        if(this.x > size*11.5) temp = size*12.5

        if(temp) {
            game.topFrogs.forEach((f) => {
                if(f.x == temp) temp = undefined
            })
        }

        return(temp)
    }
}
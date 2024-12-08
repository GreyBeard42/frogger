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
        if(this.y < size) {
            if(this.x/size%3 < 1.75 && this.x/size%3 > 0.25) {
                //this.x = round(this.x/size)*size-0.5
                this.frame = 30
                this.dir = 0
            } else {
                this.die()
            }
        }

        push()
        translate(this.x, this.y)
        rotate(this.dir*90)
        image(images[this.frame], 0, 0, size, size)
        pop()

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
    }
    controls() {
        if(!game.kdpf) {
            let move = true
            if((keyIsDown(39) || keyIsDown(68)) && this.x < width-size*2) {
                this.tx = this.x+size
                this.dir = 1
            } else if((keyIsDown(37) || keyIsDown(65)) && this.x > size) {
                this.tx = this.x-size
                this.dir = 3
            } else if((keyIsDown(38) || keyIsDown(87)) && this.y > size) {
                this.ty = this.y-size
                this.dir = 0
                if(this.retreats == 0) game.score += 10
                else this.retreats--
            } else if((keyIsDown(40) || keyIsDown(83)) && this.y < height-size*3) {
                this.ty = this.y+size
                this.dir = 2
                this.retreats++
            } else {
                this.frame = 0
                move = false
            }
            if(move) sounds.hop.play()
        }

        if(this.x > width+size/3 && this.v != 0) this.die()
        if(this.x < -size && this.v != 0) this.die()
        
        if(keyIsPressed) game.kdpf = true
        else game.kdpf = false
    }
    die() {
        frog = new Frog(size*7, size*12)
        game.frogs--
        game.time = 60
        sounds.main.stop()
        sounds.respawn.play()
    }
    collision(other) {
        if(abs(other.y-round(this.y)) < size/4) {
            //if(other.x-other.w/2 < this.x+size/3 && other.x+other.w/2 > this.x-size/3) {
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
                    if(abs(l.y-round(this.y)) < size/2) {
                        //if(l.x-size/3 < this.x+size/3 && l.x+size/3 > this.x-size/3) {
                        if(abs(l.x-round(this.x)) < size*0.7) {
                            output = l.v
                        }
                    }
                })
            })
        })
        return output
    }
}
// vector class holding x position and y position
class Vec {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    // get length of vector; hypotenuse
    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    set len(value) { // value - length of the vector
        const fact = value / this.len // want the factor; we have factor of the value we want to set and the one we have
        this.x *= fact
        this.y *= fact
    }
}

// rectangle w-width h-height
class Rect {
    constructor(w, h) {
        this.pos = new Vec
        this.size = new Vec(w, h)
    }
    // left side of ball
    get left() {
        return this.pos.x - this.size.x / 2 // get left end of rectangle
    }
    // right side of ball
    get right() {
        return this.pos.x + this.size.x / 2 // get right end of rectangle
    }
    // top side of ball
    get top() {
        return this.pos.y - this.size.y / 2 // get top end of rectangle
    }
    // bottom side of ball
    get bottom() {
        return this.pos.y + this.size.y / 2 // get bottom end of rectangle
    }            
}

// inheritance
class Ball extends Rect {
    constructor() {
        super(10, 10) // get access to parent's (Rect) properties and methods
        this.vel = new Vec // vel = velocity
    }
}

class Player extends Rect {
    constructor() {
        super(20, 100)
        this.score = 0 // score starts at 0
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas
        this._context = canvas.getContext('2d')

        // create new ball
        this.ball = new Ball

        this.players = [
            new Player,
            new Player
        ]
        // player 1 and player 2
        this.players[0].pos.x = 40 // 40 pixels from the left
        this.players[1].pos.x = this._canvas.width - 40 // 40 pixels from the right
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2
        })

        // animation frame
        let lt //lt - last time
        const callback = (ms) => { //ms - milliseconds
            if(lt) {
                this.update((ms - lt) / 1000) // convert to whole seconds
            }
            lt = ms
            requestAnimationFrame(callback)
        } 
        callback()

        // scoreboard - the array contains values in which the scores will be displayed
        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111'
        ].map(str => {
            const canvas = document.createElement('canvas')
            canvas.height = this.CHAR_PIXEL * 5
            canvas.width = this.CHAR_PIXEL * 3
            const context = canvas.getContext('2d')
            context.fillStyle = '#FFFFFF'
            str.split('').forEach((fill, i) => { // fill = 1 or 0; i = index
                if (fill === '1') {
                    context.fillRect(
                        (i % 3) * this.CHAR_PIXEL,
                        (i / 3 | 0) * this.CHAR_PIXEL,
                        this.CHAR_PIXEL,
                        this.CHAR_PIXEL)
                }
            })
            return canvas
        })

        this.reset()
    }

    // paddle hitting the ball
    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left && 
            player.top < ball.bottom && player.bottom > ball.top)  {
                const len = ball.vel.len
                ball.vel.x = -ball.vel.x // negative velocity at x
                ball.vel.y += 300 * (Math.random() - 0.5)
                ball.vel.len = len * 1.05 // increase the ball speed when it makes contact with the paddle
            }
    }

    draw() {            
        // canvas color
        this._context.fillStyle = '#000000';
        this._context.fillRect(0,0, this._canvas.width, this._canvas.height)

        // draw ball here
        this.drawRect(this.ball)

        // draw player/paddle here
        this.players.forEach(player => this.drawRect(player))
        
        // draw score here
        this.drawScore()       
    }

    // draw rectangle
    drawRect(rect) {    
        // ball color
        this._context.fillStyle = '#FFD700';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y)
    }

    drawScore() {
        const ALIGN = this._canvas.width / 3
        const CHAR_W = this.CHAR_PIXEL * 4
        this.players.forEach((player, index) => {
            const CHARS = player.score.toString().split('') // toString as a num gives you back a string as num
            const OFFSET = ALIGN * 
                            (index + 1) - 
                            (CHAR_W * CHARS.length / 2) + 
                            this.CHAR_PIXEL / 2 
            CHARS.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0],
                                        OFFSET + pos * CHAR_W, 20) // draw on pong image
            })
        })
    }

    reset() {
        // ball position
        this.ball.pos.x = this._canvas.width / 2 // ball in middle
        this.ball.pos.y = this._canvas.height / 2 

        // ball velocity initialized with a  click
        this.ball.vel.x = 0
        this.ball.vel.y = 0
    }

    // check ball speed
    start() {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            // ball starts on the right or left
            this.ball.vel.x = 350 * (Math.random() > .5 ? 1 : -1) 
            this.ball.vel.y = 350 * (Math.random() * 2 - 1) // speed of ball up and down gets tweaked a little bit
            this.ball.vel.len = 200 // ball will have consistent speed to start
        }
    }

    // animate ball; dt- deltaTime
    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt // movement of ball relative to time difference of update methods
        this.ball.pos.y += this.ball.vel.y * dt
    
        // detect if ball touches corners of screen (bouncing)
        if(this.ball.left < 0 || this.ball.right > this._canvas.width) {
            const playerId = this.ball.vel.x < 0 | 0 // convert true/false to int
            this.players[playerId].score++
            console.log(playerId)
            this.reset()
        }
        if(this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y
        }

        this.players[1].pos.y = this.ball.pos.y // makes player 2 follow the ball

        this.players.forEach(player => this.collide(player, this.ball))
        
        this.draw()
    }    
}

// canvas
const canvas = document.getElementById('pong');
const pong = new Pong(canvas)

// player 1 controls the mouse
canvas.addEventListener('mousemove', event => {
    // mitigate for an upscale canvas here
    const SCALE = event.offsetY / event.target.getBoundingClientRect().height // scale factor here
    pong.players[0].pos.y = canvas.height * SCALE
})

// start on click
canvas.addEventListener('click', event => {
    pong.start()
})


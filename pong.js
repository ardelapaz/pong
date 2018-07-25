class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(width, height) {
        this.pos = new Vec(0, 0);
        this.size = new Vec(width, height);
    }
    
    get left() {
        return this.pos.x - this.size.x / 2;
    }
    get right() {
        return this.pos.x + this.size.x / 2;
    }
    get top() {
        return this.pos.y - this.size.y / 2;
    }
    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect {
    constructor() {
        super (10,10);
        this.vel = new Vec;
    }
}

class Player extends Rect {
    constructor(){
    super (10, 75)
    this.score = 0;
    this.vel = new Vec;
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball();
        console.log(this.ball);

        this.ball.pos.x = 100;
        this.ball.pos.y = 50;
        
        this.ball.vel.x = 150;
        this.ball.vel.y = 150;

        this.players = [
            new Player(),
            new Player(),
        ];

        this.players[0].pos.x = 50;
        this.players[1].pos.x = this._canvas.width - 50;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2 
        });

        let lastTime = null;
        this.callback = (millis) => {
            if (lastTime !== null) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this.callback);
        };
        requestAnimationFrame(this.callback);
     }

    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;

        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.hasScored();

        // all of this is to control the ball's position on the screen (to make sure it doesn't go off screen). Will be implemented officially with the ai implementation.
        if (this.players[1].top < this._canvas.height / 2) {
            this.players[1].vel.y = -10;
        } else {
            this.players[1].vel.y = 10;
        }
        this.positionCheck(this.players[1], this.players[1].pos.y, this.players[1].vel.y);


        this.players.forEach(player => {
            this.collide(player, this.ball);
        });
        this.render();
    }

    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
    
     render() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    
    }

    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
                ball.vel.x = -ball.vel.x * 1.05; // to slowly speed up the ball
            }
    }

    hasScored() {
        if (this.ball.right > this._canvas.width) {
            this.players[0].score = this.players[0].score + 1;
            this.reset();
            this.play(1);
        }
        if (this.ball.left < 0) {
            this.players[1].score = this.players[1].score + 1;
            this.reset();
            this.play(-1);
        }
}

    reset() {
        const b = this.ball;
        b.vel.x = 0;
        b.vel.y = 0;
        b.pos.x = this._canvas.width / 2;
        b.pos.y = this._canvas.height / 2;
    }

    play(advantage) {
        // Player who scored last gets kickoff advantage
        this.ball.vel.x = 150 * advantage;
        this.ball.vel.y = 150 * advantage;

    }
    //
    //
    //
    //
    //
    //
    //

    positionCheck(player, position, velocity) { // this is temporary for the ai to be in the play boundary
        console.log(velocity)
        if (player.top <= 0 && velocity == -10 && this.ball.vel.y < 0 || player.bottom >= canvas.height && velocity == 10 && this.ball.vel.y > 0) {
            return;
        }
        this.players[1].pos.y = this.ball.pos.y;
    }    
}   


































const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

function positionCheck(player, position, velocity) {
    if (player.top <= 0 && velocity == -10 || player.bottom >= canvas.height && velocity == 10) {
        return;
    }
    return player.pos.y += velocity;
}

window.addEventListener('keydown', event => {
// Replace key with whatever key, multiple functions for checking what key is which. Still have to make ai too :( 
    var a = [];
    a.push(event.keyCode);
    a.forEach(key => {
        if (a == 38) {
            pong.players[0].vel.y = -10;
            positionCheck(pong.players[0], pong.players[0].pos.y, pong.players[0].vel.y);
        }
        if (a == 40) {
            pong.players[0].vel.y = 10;
            positionCheck(pong.players[0], pong.players[0].pos.y, pong.players[0].vel.y);
        }
    });
});
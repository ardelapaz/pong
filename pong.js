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

        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            this.ball.vel.x = -this.ball.vel.x;
        }
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }

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
}   

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

function positionCheck(position, number) {
    console.log(pong.players[0].top);
    if (pong.players[0].top <= 0 && number == -10 || pong.players[0].bottom >= canvas.height && number == 10) {
        return;
    }
    return pong.players[0].pos.y += number;
}

window.addEventListener('keydown', event => {
// Replace key with whatever key, multiple functions for checking what key is which. Still have to make ai too :( 
    var a = [];
    a.push(event.keyCode);
    a.forEach(key => {
        if (a == 38) {
            positionCheck(pong.players[0].pos.y, -10);
        }
        if (a == 40) {
            positionCheck(pong.players[0].pos.y, 10);
        }
    });
});
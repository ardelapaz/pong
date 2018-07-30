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

        this.players = [
            new Player(),
            new Player(),
        ];

        this.reset();

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
        this.aiLogic();  
        this.positionCheck(this.players[1], this.players[1].vel.y);
        this.isKeyPressed();
        this.players.forEach(player => {
            this.collide(player, this.ball);
        });

        if (this.players[1].score == 1) {
            this.endGame();
        } else {
        this.render();
        }
    }




    //
    // All functions are listed below
    //

    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
    
     render() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
        this.drawScore();
    
    }

    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
                ball.vel.x = -ball.vel.x * 1.10; // to slowly speed up the ball
            }
    }

    hasScored() {
        if (this.ball.right > this._canvas.width) {
            this.players[0].score = this.players[0].score + 1;
            if (this.players[0].score == 1) {
                this.endGame();
            }
            this.reset();
            this.play(1);
        }
        if (this.ball.left < 0) {
            this.players[1].score = this.players[1].score + 1;
            if (this.players[0].score == 1) {
                this.endGame();
            }
            this.reset();
            this.play(-1);
        }

    }   

    reset() {
        const b = this.ball;
        b.vel.x = 100;
        b.vel.y = 100;
        b.pos.x = this._canvas.width / 2;
        b.pos.y = this._canvas.height / 2;

        const p = this.players[0];
        p.pos.x = 50;
        p.pos.y = p.pos.y = this._canvas.height / 2;
        
        const a = this.players[1];
        a.pos.x = this._canvas.width - 50
        a.pos.y = p.pos.y = this._canvas.height / 2;
    }

    play(advantage) {
        // Player who scored last gets kickoff advantage
        this.ball.vel.x = 100 * advantage;
        this.ball.vel.y = 100 * advantage;

    }

    positionCheck(player, velocity) {
        if (player.bottom >= this._canvas.height && velocity >= 0 || player.top <= 0 && velocity <= 0) {
            return;
        }
        if (player.bottom >= this._canvas.height && velocity == 3 || player.top <= 0 && velocity == -3) {
            return;
        }
        player.pos.y += velocity;
    }    

    isKeyPressed() {
        if (keyState[38]) {
            this.players[0].vel.y = -3;
        } else if (keyState[40]) {
            this.players[0].vel.y = 3;
        } else {
            this.players[0].vel.y = 0;
        }
        this.positionCheck(this.players[0], this.players[0].vel.y);
    }

    aiLogic() {
        if (this.players[1].bottom - this.ball.bottom < 70 && this.players[1].bottom - this.ball.bottom > 0) {
            this.players[1].vel.y = 1.5;
        } else if (this.players[1].bottom < this.ball.bottom) {
            this.players[1].vel.y = 1.5;
        } else {
            this.players[1].vel.y = -1.5;
        }
    }

    drawScore() {
        this._context.font = "30px Arial";
        this._context.fillStyle = "#FFFFFF";
        this._context.fillText(this.players[0].score, 200, 50);

        this._context.font = "30px Arial";
        this._context.fillStyle = "#FFFFFF";
        this._context.fillText(this.players[1].score, (this._canvas.width - 200), 50);
    }

    endGame() {
        console.log('test');
        window.stop();
        this._context.font = "30px Arial";
        this._context.fillStyle = "#FFFFFF";
        this._context.fillText("Game Over! \n Refresh to play again!", 300, 300);
    }
    
}   



const canvas = document.getElementById('pong');
const pong = new Pong(canvas);



// Pulled off of stack overflow to track keypresses, very useful :)

var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);
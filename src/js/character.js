
const state = {
    onGround: "onGround",
    inAir: "inAir",
}

export default class Character {
    constructor( spritesheetStates, rows, cols) {
        this.id = null;
        this.image = new Image();
        this.spritesheet = {
            states: spritesheetStates,
            width: 0,
            height: 0,
            rows,
            cols,
        };
        this.animationState = "chargedAttack"
        this.sprite = {
            width: 0,
            height: 0,
            scale: 2,
            i: this.spritesheet.states[this.animationState].i,
            j: 0,
            maxFrames: this.spritesheet.states[this.animationState].maxFrames
        };
        this.ctx = null;
        this.x = 0;
        this.y = 0;
        this.moving = {
            left: false,
            right: false
        },
        this.velocity = {
            x: 0,
            y: 0
        };
        this.physicalState = state.inAir;
        this.attackState = null;
        this.horizontalBlocksArray = [];
        this.horizontalBlock = {
            width: 100,
            height: 10
        };
        this.bulletsArray = [];
        this.bulletSize = 50;
        this.connected = false;
        this.room_id = null;
        this.playerNumber = null;
    }

    render() {
        if(this.connected){
            this.ctx.drawImage(
                this.image,
                this.sprite.width*this.sprite.j, this.sprite.height*this.sprite.i,
                this.sprite.width, this.sprite.height,
                this.x, this.y,
                this.sprite.width*this.sprite.scale, this.sprite.height*this.sprite.scale 
            )

            this.sprite.j++;
            if(this.sprite.j > this.sprite.maxFrames) this.sprite.j = 0;
        }
    }

    moveLeft(speed) {
        this.velocity.x = -speed.x;
    }

    moveRight(speed) {
        this.velocity.x = +speed.x;
    }

    movementManager() {
        if (this.velocity.x != 0) {
            let p = this.velocity.x/Math.abs(this.velocity.x);
            p *= 5;
            this.velocity.x -= p;
            this.x += p;
        }
    }

    jump() {
        this.physicalState = state.inAir;
        if(! this.attackState)this.sprite.j = 0;
        this.y -= 1;
        this.velocity.y = -10;
    }

    changeAnimationTo( animationName ) {
                
        this.sprite.i = this.spritesheet.states[animationName].i;
        this.sprite.j = 0;
        this.sprite.maxFrames = this.spritesheet.states[animationName].maxFrames;
        
    }

    createHorizontalBlock() {    
        this.horizontalBlocksArray.push(
            {
                x: this.x + this.sprite.width*this.sprite.scale/2 - this.horizontalBlock.width/2,
                y: this.y + this.sprite.height*this.sprite.scale + 20 ,
                sTime: Date.now()
            }
        )
    }
}
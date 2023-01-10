<template>
    <div>
        <canvas
        ref="story-canvas"
        class="story-canvas"
        ></canvas>
        <div class="prompt-container">
            <div class="text-prompt">"This is you!"</div>
            <div class="text-prompt">"your opponent is hiding somewhere in here"</div>
            <div class="text-prompt">But you both don't know each others position</div>
            <div class="text-prompt opponent-dialogue">*attack!</div>
            <div class="text-prompt"></div>
            <div class="text-prompt">"Attacking reveals your position"</div>
            <div class="text-prompt">"But because there is a connection"</div>
            <div class="text-prompt">"They could have switched their position"</div>
            <div class="last text-prompt ">
                <div>So which bunker should we attack?</div>
                <router-link class="play-button" href="/lobby"> PLAY NOW </router-link>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "HowToPlay",

    data() {
        return {
            canvas: null,
            ctx: null,
            cWidth: window.innerWidth,
            cHeight: window.innerHeight,
            cellSize: 0,
            
            bunkerSS : new Image(),
            asteroidSS : new Image(),
            arrowSS : new Image(),
            explosionSS: new Image(),
            backgroundSS: new Image(),
            skySS: new Image(),

            bunkerSize: 0,
            bunkerJ: 0,

            asteroidSize: 0,
            asteroidX: 0, 
            asteroidY: 0,
            asteroidJ: 0,
            astroidFalling: true,
            
            arrowX: 0,
            arrowY: 0,
            arrowSize: 0,
            arrowRotation: 1,
            
            explosionSize: 0,
            explosionX: 0, 
            explosionY: 0,
            explosionJ: 0,
            boom: false,
            canBoom : false,

            backgroundW: 0,
            backgroundH: 0,

            skyW: 0,
            skyH: 0,

            fX: this.cWidth/6,
            fY: this.cHeight - 3*this.cellSize,
            ff: 0,

            now: 0,
            then: 0,
            
        }
    },

    methods: {
        init() {
            this.canvas = this.$refs['story-canvas'];
            this.canvas.width = this.cWidth,
            this.canvas.height = this.cHeight,
            this.ctx = this.canvas.getContext("2d");

            this.initDimentions();
            
            window.addEventListener("resize", ()=> this.initDimentions());
            screen.orientation.addEventListener("change", ()=> {
                this.initDimentions();
            })

            window.addEventListener("scroll", ()=> {

                if (window.scrollY > 4*this.cHeight)
                    this.arrowX = -100
                
                if (window.scrollY > 7*this.cHeight + this.cellSize)
                    this.arrowRotation = 0;
                else
                    this.arrowRotation = 1; 

                if (window.scrollY > 9*this.cHeight) {
                    this.arrowX = this.cWidth - this.fX - 1.5*this.cellSize
                    this.arrowY = Math.min(this.fY + this.cellSize*1.2, this.fY + this.cellSize/4 + ((window.scrollY - 9*this.cHeight))/3)
                }
                else if (window.scrollY > 8*this.cHeight) {
                    this.arrowX = this.cWidth - this.fX - 1.5*this.cellSize
                    this.arrowY = Math.min(this.fY + this.cellSize/1.5, this.fY + this.cellSize/4 + ((window.scrollY - 8*this.cHeight))/3)
                }
                else if (window.scrollY > 7*this.cHeight + this.cellSize) {
                    this.arrowX = this.cWidth - this.fX - 1.5*this.cellSize
                    this.arrowY = this.fY + this.cellSize/4
                }
                else if (window.scrollY > 5.5*this.cHeight) {
                    
                     if (this.asteroidY > this.fY + this.cellSize ) {
                        this.asteroidY = -this.cellSize/2;
                        this.astroidFalling = false;
                        if (this.canBoom) {
                            this.boom = true;
                            this.canBoom = false;
                        }

                    } else if (this.astroidFalling)
                        this.asteroidY = -this.cellSize/2 + (window.scrollY - 5.5*this.cHeight)*((this.fY + this.cellSize)/this.cHeight)
                    
                }
                else if (window.scrollY > 5*this.cHeight) {
                    this.astroidFalling = true;
                    this.canBoom = true;
                    this.ff = 0;
                    this.bunkerJ = Math.min(5, Math.floor((window.scrollY - 5*this.cHeight)/(this.cHeight/12)))
                }
                else if (window.scrollY > 4*this.cHeight) {
                    this.arrowX = -100
                }
                else if (window.scrollY > 3*this.cHeight) {
                    this.arrowX = Math.min(this.cWidth - this.fX - this.cellSize + this.cellSize/4, this.fX + this.cellSize/4 + (window.scrollY - 3*this.cHeight)*((this.cWidth - 2*this.fX - this.cellSize)/(this.cHeight/2)));
                } else if (window.scrollY < 3*this.cHeight) {
                    this.arrowX = this.fX + this.cellSize/4
                    this.arrowY = this.fY - this.cellSize/2
                }
            })                

            this.animate();
            
        },

        initDimentions() {

            console.log("Resizing!");

            this.cWidth = window.innerWidth;
            this.cHeight = window.innerHeight;

            if (this.cWidth*1.3 < this.cHeight) {
                this.cellSize = this.cWidth/4;
                this.fY = this.cHeight - 2.5*this.cellSize;
                
            } else {
                this.cellSize = this.cHeight/5;
                this.fY = this.cHeight - 2.3*this.cellSize;
            }

            if (this.cWidth/(this.fY + this.cellSize) > this.skySS.width/this.skySS.height) {
                this.skyW = this.skySS.width;
                this.skyH = (this.fY + this.cellSize)/this.cWidth * this.skySS.width;
            } else {
                this.skyH = this.skySS.height;
                this.skyW = this.cWidth/(this.fY + this.cellSize) * this.skySS.height;
            }

            if (this.cWidth / (this.cHeight -  this.fY + this.cellSize) > this.backgroundSS.width/this.backgroundSS.height) {
                this.backgroundW = this.backgroundSS.width;
                this.backgroundH = (this.cHeight -  this.fY + this.cellSize)/this.cWidth * this.backgroundSS.width
            } else {
                this.backgroundH = this.backgroundSS.height;
                this.backgroundW = this.cWidth / (this.cHeight -  this.fY + this.cellSize) * this.backgroundSS.height;
            }

            this.fX = this.cWidth/6;
            
            this.arrowX = this.fX + this.cellSize/4
            this.arrowY = this.fY - this.cellSize/2

            this.asteroidX = this.arrowX;
            this.asteroidY = -this.cellSize/2;

            this.explosionX = this.fX  - this.cellSize/5;
            this.explosionY = this.fY + this.cellSize - this.cellSize/5;
        },

        renderBunkers() {

            this.ctx.drawImage(this.bunkerSS,
            this.bunkerSize*7, 0, this.bunkerSize, this.bunkerSize,
            this.fX, this.fY, this.cellSize - 10, this.cellSize - 10
            )

            this.ctx.drawImage(this.bunkerSS,
            this.bunkerSize*this.ff, 0, this.bunkerSize, this.bunkerSize,
            this.fX, this.fY + this.cellSize, this.cellSize - 10, this.cellSize - 10
            )

            this.ctx.drawImage(this.bunkerSS,
            this.bunkerSize*this.bunkerJ, 0, this.bunkerSize, this.bunkerSize,
            this.cWidth - this.cellSize - this.fX, this.fY, this.cellSize - 10, this.cellSize - 10
            )

            this.ctx.drawImage(this.bunkerSS,
            0, 0, this.bunkerSize, this.bunkerSize,
            this.cWidth - this.cellSize - this.fX, this.fY + this.cellSize, this.cellSize - 10, this.cellSize - 10
            )
        },

        renderArrow(x, y, j) {

            this.ctx.drawImage(this.arrowSS,
            this.arrowSize*j, 0, this.arrowSize, this.arrowSize,
            x, y, this.cellSize/2, this.cellSize/2)

        },

        renderAstroid() {

            this.ctx.drawImage(
                this.asteroidSS, 
                this.asteroidSize*this.asteroidJ, 0, this.asteroidSize, this.asteroidSize,
                this.asteroidX, this.asteroidY, this.cellSize/2, this.cellSize/2
            )

        },

        renderExplosion() {
            this.ctx.drawImage(this.explosionSS,
            this.explosionSize*this.explosionJ, 0, this.explosionSize, this.explosionSize,
            this.explosionX, this.explosionY, this.cellSize*1.2, this.cellSize*1.2);
        },

        animate() {
            this.now = Date.now();
            if (this.now - this.then > 100) {
                this.then = this.now
                this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
                
                this.ctx.drawImage(this.skySS,
                0, 0, this.skyW, this.skyH,
                0, 0, this.cWidth, this.fY+this.cellSize);
                
                this.ctx.drawImage(this.backgroundSS,
                0, 0, this.backgroundW, this.backgroundH,
                0, this.fY - this.cellSize/2 , this.cWidth, this.cHeight - this.fY + this.cellSize)

                this.ctx.fillStyle = 'white'
                this.ctx.fillRect(this.cWidth - this.cellSize/1.5 - this.fX, this.fY + this.cellSize/2, 10, this.cellSize
                )


                this.renderBunkers();
                this.renderArrow(this.arrowX, this.arrowY, this.arrowRotation);
                this.renderAstroid();
                if (this.boom){
                    this.renderExplosion();
                    this.explosionJ++;
                }
                this.asteroidJ++;
                if (this.asteroidJ > 3) this.asteroidJ = 0;
                if (this.explosionJ > 8)
                    this.ff = 6;
                if (this.explosionJ > 17){
                    this.explosionJ = 0; 
                    this.boom = false;

                }
            }
            window.requestAnimationFrame(this.animate);
        }
    },

    created() {

      this.asteroidSS.src = require("../assets/boltSpriteSheetV.png");
      this.bunkerSS.src = require("../assets/BunkerSSRed.png");
      this.explosionSS.src= require("../assets/explosion.png");
      this.arrowSS.src = require("../assets/arrow.png");
      this.backgroundSS.src = require("../assets/background.png");
      this.skySS.src = require("../assets/sky.png");
      

      Promise.all(Array.from([this.asteroidSS, this.bunkerSS, this.explosionSS, this.arrowSS, this.backgroundSS, this.skySS]).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        this.explosionSize = this.explosionSS.width/18;
        this.asteroidSize = this.asteroidSS.width/4;
        this.bunkerSize = this.bunkerSS.width/8;
        this.arrowSize = this.arrowSS.width/2;
        
        this.init();
    });

    }

}
</script>

<style scoped>

    .htp {
        font-family: Oswald;
        font-size: 4rem;
        position: relative;        
    }

    .story-canvas {
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: antiquewhite;
    }

    .text-prompt {
        position: relative;
        font-family: Roboto;
        font-size: 1.5rem;
        height: 100vh;
        max-width: 30vw;
        text-align: center;
        z-index: 3;
        color: white;
    }
    
    .last {
        display: flex;
        max-width: 100%;
        flex-direction: column;
        justify-content: center;
    }

    .last * {
        color: white;
    }

    
    .prompt-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .play-button {
        margin-top: 1rem;
    }

    @media (max-width : 700px) {
        .text-prompt {
            font-size: 1rem;
        }
    }
    
</style>
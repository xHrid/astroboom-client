<template>
  <div class="game-outer">
    <div class="gameOver" v-show="gameEnded">
      <div class="center-div">
        <div class="winText">
          {{endText}}
        </div>
        <a class="play-button" href="lobby">Next Match</a>
      </div>
    </div>
    <div v-if="mode == 'c'" >Your match code is : {{lobbyCode}}</div>
    <canvas v-show="!start" ref="waiting-canvas"></canvas>
    <div class="instruction-wrapper">
      <canvas v-show="start" ref="game-canvas"> </canvas>
      <div class="instruction-text" v-show="start">{{ instructionText }}</div>
      <div v-show="start && !gameEnded" class="contoller">
        <button
          :disabled="!yourTurn || moveSelected == 'build' || canNotBuild"
          @click="buildingMode"
        >
          Build
        </button>
        <button
          :disabled="!yourTurn || moveSelected == 'attack'"
          @click="attackingMode"
        >
          Attack
        </button>
        <button :disabled="!validMove" @click="go">Go</button>
      </div>
    </div>
    <canvas v-show="start"
    ref="asteroid-canvas"
    class="asteroid-canvas"></canvas>
    
  </div>
</template>

<script>
import colorCode from "@/js/colorCode";
import mapMixins from "@/mixins/mapMixins";
import socketMixins from "@/mixins/socketMixins";
import eventHandlerMixins from "@/mixins/eventHandlerMixins";
import renderWSmixins from "@/mixins/renderWSmixins";
import connectionRelatedMixins from "@/mixins/connectionRelatedMixins";
import cellMixins from "@/mixins/cellMixins";

export default {
  name: "TurnBasedGameComp",

  data() {
    return {
      gameCanvas: null,
      waitingCanvas: null,
      asteroidCanvas: null,
      ctx: null,
      wctx: null,
      actx: null,
      cWidth: 900,
      cHeight: 500,
      rect: {
        left: 0,
        top: 0,
      },

      homeSize: 120,
      bunkerImgSize: 0,
      exploasionImageSize: 0,

      asteroidSS: new Image(),
      bunkerSS: new Image(),
      explosionSS: new Image(),
      backgroundSS: new Image(),


      p1Map: [],
      p2Map: [],

      p1MapOffset: {
        i: 0,
        j: 0
      },

      p2MapOffset: {
        i: 0,
        j: 0
      },

      mousePosition: {
        x: 0,
        y: 0,
      },

      playerPostion: {
        i: 0,
        j: 0,
      },

      p2Position: null,
      endText: "",

      moveSelected: null,
      activeCells: [],
      attackCell: [],

      activeMap: null,
      socket: null,
      matched: false,
      start: false,
      yourTurn: false,
      validMove: false,
      p2Name: "BigBro",

      returnFlag: false,
      safeSquares: [],

      asteroidX: 0,
      asteroidY: -50,
      asteroidSize: 0,
      asteroidJ: 0,
      asteroidsVelocity: 0,
      asteroidAcceleration: 0,

      explosionX: 0,
      explosionY: 0,
      explosionJ: 0,
      explosionFrameId: null,
      explosionW: 0,
      explosionH: 0,
      explosionNow: 0,
      explosionThen: 0,
      canNotBuild: false,

      afterAttackAnimationData: null,

      now: 0,
      then: 0,

      astroidAnimationId: null,
      gameEnded : false,

      lastAttackedSquare : {
        x: 0,
        y: 0
      },

      instructionText: "",
      
    };
  },

  computed: {
    lobbyCode() {
      return this.$store.state.lobbyCode;
    },
    p1Name() {
      return this.$store.state.user.name;
    },
    p1Email() {
      return this.$store.state.user.email;
    },
    mode() {
      return this.$store.state.mode;
    },
  },

  methods: {
    init() {
      this.gameCanvas = this.$refs["game-canvas"];
      this.gameCanvas.width = this.cWidth;
      this.gameCanvas.height = this.cHeight;
      this.ctx = this.gameCanvas.getContext("2d");

      this.waitingCanvas = this.$refs["waiting-canvas"];
      this.waitingCanvas.width = this.cWidth;
      this.waitingCanvas.height = this.cHeight;
      this.wctx = this.waitingCanvas.getContext("2d");

      
      this.asteroidCanvas = this.$refs["asteroid-canvas"];
      this.asteroidCanvas.width = this.cWidth;
      this.asteroidCanvas.height = this.cHeight;
      this.actx = this.asteroidCanvas.getContext("2d");
      
      this.asteroidSize = this.asteroidSS.width/4;
      
      this.initDimentions()
      window.addEventListener("resize", ()=> this.initDimentions())
      screen.orientation.addEventListener("change", ()=> {
        this.initDimentions()
      })

      this.gameCanvas.addEventListener("mousemove", (event) => {
        this.mousePosition.x = event.clientX - this.rect.left;
        this.mousePosition.y = event.clientY - this.rect.top;
      });

      this.gameCanvas.addEventListener("click", (e) => {
        const x = e.x - this.rect.left;
        const y = e.y - this.rect.top;
        this.clickHandler(this.activeMap, x, y);
      });

      


      this.animate();
    },

    initDimentions() {
      
      this.cWidth = window.innerWidth*0.8,
      this.cHeight =  window.innerHeight*0.8,
      this.homeSize = this.cHeight/5
      this.rect = this.gameCanvas.getBoundingClientRect();


      this.p1MapOffset = {
        i: this.cWidth/4 - this.homeSize,
        j: this.cHeight/5,
      }

      this.p2MapOffset = {
        i: this.cWidth*3/4 - this.homeSize,
        j: this.cHeight/5,
      }

      if (this.cWidth*1.2  < this.cHeight){
        this.homeSize = this.cHeight/9

        this.p1MapOffset = {
          i: this.cWidth/2 - this.homeSize,
          j: (this.cHeight/9)*5,
        }

        this.p2MapOffset = {
          i: this.cWidth/2 - this.homeSize,
          j: (this.cHeight/9),
        }
      }

      this.backgroundH = this.backgroundSS.height;
      this.backgroundW = this.backgroundH/this.cHeight*this.cWidth;

      this.gameCanvas.width = this.cWidth;
      this.gameCanvas.height = this.cHeight;
      this.ctx = this.gameCanvas.getContext("2d");

      this.waitingCanvas.width = this.cWidth;
      this.waitingCanvas.height = this.cHeight;
      this.wctx = this.waitingCanvas.getContext("2d");

      this.asteroidCanvas.width = this.cWidth;
      this.asteroidCanvas.height = this.cHeight;
      this.actx = this.asteroidCanvas.getContext("2d");

    },

    attackingMode() {
      this.moveSelected = "attack";
      this.activeMap = this.p2Map;
      this.resetMapStatus(this.p1Map);
    },

    buildingMode() {
      if (this.moveSelected != "build") {
        this.moveSelected = "build";
        this.activeMap = this.p1Map;
        this.resetMapStatus(this.p2Map);
      }
    },

    go() {
      this.yourTurn = false;
      this.activeMap = null;
      if (this.moveSelected == "build")
        this.socket.emit("go", this.moveSelected, this.activeCells);
      else if (this.moveSelected == "attack") {
        this.initiateReturn();
      }
    },

    animateAttack() {
      this.asteroidsVelocity += 0.01;
      this.asteroidX = this.lastAttackedSquare.x + this.homeSize/6;
      if (this.asteroidY < this.lastAttackedSquare.y) {
        this.asteroidY+= this.asteroidsVelocity;
        this.astroidAnimationId = window.requestAnimationFrame(this.animateAttack);
      } else {
        this.asteroidsVelocity = 0
        this.asteroidY = -50;
        this.explosionAnimation()
        window.cancelAnimationFrame(this.astroidAnimationId);
      }
    },

    explosionAnimation() {

      this.explosionNow = Date.now();

      if (this.explosionNow - this.explosionThen > 100) {
        this.explosionThen = this.explosionNow;
        
        if (this.explosionJ < 18) {
          this.actx.clearRect(0, 0, this.cWidth, this.cHeight);
          this.actx.drawImage(this.explosionSS,
          this.exploasionImageSize*this.explosionJ, 0, this.exploasionImageSize, this.exploasionImageSize,
          this.explosionX, this.explosionY, this.explosionW, this.explosionH
          )
          this.explosionJ++;
        } else {
          
          if (this.afterAttackAnimationData.p1Data) {
            (this.p1Map = JSON.parse(JSON.stringify(this.afterAttackAnimationData.p1Data))),
            this.arrayMapToPixelMap(this.p1Map, 100, 100);
          }
          
          if (this.afterAttackAnimationData.p2Data) {
            (this.p2Map = JSON.parse(JSON.stringify(this.afterAttackAnimationData.p2Data))),
            this.arrayMapToPixelMap(this.p2Map, 600, 100);
          }
          
          this.yourTurn = this.afterAttackAnimationData.yourTurn;
         
          window.cancelAnimationFrame(this.explosionFrameId);
          
        }
      }
      if (this.explosionJ < 18)
        this.explosionFrameId = window.requestAnimationFrame(this.explosionAnimation);
      else {
        if (this.afterAttackAnimationData.p1Data) {
          (this.p1Map = JSON.parse(JSON.stringify(this.afterAttackAnimationData.p1Data))),
          this.arrayMapToPixelMap(this.p1Map, 100, 100);
        }
        
        if (this.afterAttackAnimationData.p2Data) {
          (this.p2Map = JSON.parse(JSON.stringify(this.afterAttackAnimationData.p2Data))),
          this.arrayMapToPixelMap(this.p2Map, 600, 100);
        }
        this.actx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.yourTurn = this.afterAttackAnimationData.yourTurn;
        window.cancelAnimationFrame(this.explosionFrameId);
        
      }

    },  


    animate() {

      if (!this.start) this.rednerWaitinScreen();

      if (this.returnFlag) {
        this.instructionText = "Select your new position"
      } else if (!this.yourTurn) {
        this.instructionText = "Opponent's Turn: waiting"
      } else if (!this.moveSelected) {
        this.instructionText = "Select a move"
      } else if (this.validMove) {
        this.instructionText = "Goo! if you are ready"
      } else if (this.moveSelected == "attack") {
        this.instructionText = "Select a block to hit"
      } else if (this.moveSelected == "build") {
        this.instructionText = "Select any two blocks to make connection"
      }

      this.rect = this.gameCanvas.getBoundingClientRect();
      this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.cWidth, this.cHeight);
      this.ctx.drawImage(this.backgroundSS, 0, 0, this.backgroundW, this.backgroundH,
      0, 0, this.cWidth, this.cHeight)

      if (this.moveSelected == "build") {
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = colorCode.buildArena;
        this.ctx.fillRect(
            this.p1Map[0].x - this.homeSize/4, this.p1Map[0].y - this.homeSize/4,
            this.homeSize*2 + this.homeSize/2, this.homeSize*3 + this.homeSize/2);
        this.ctx.globalAlpha = 1;
      } else if (this.moveSelected == "attack") {
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = colorCode.attackArena;
        this.ctx.fillRect(
            this.p2Map[0].x - this.homeSize/4, this.p2Map[0].y - this.homeSize/4,
            this.homeSize*2 + this.homeSize/2, this.homeSize*3 + this.homeSize/2);
        this.ctx.globalAlpha = 1;

      }

      if (
        (this.moveSelected == "attack" && this.activeCells.length == 1) ||
        (this.moveSelected == "build" && this.activeCells.length == 2)
      ) {
        this.validMove = true;
      } else this.validMove = false;

      if (this.activeMap) {
        this.detectHover(this.activeMap);
        if (this.activeCells.length < 2) this.elegibleToConnect(this.p1Map);
        else {
          this.renderPotentialConnection();
        }
      }

      this.arrayMapToPixelMap(this.p1Map, this.p1MapOffset.i, this.p1MapOffset.j);
      this.arrayMapToPixelMap(this.p2Map, this.p2MapOffset.i, this.p2MapOffset.j);
      this.renderConnection(this.p1Map);
      this.renderConnection(this.p2Map);
      this.renderMap(this.p1Map);
      this.renderMap(this.p2Map);

      if (this.returnFlag) this.renderSafeSqares();
      if (this.p2Position) {
        const p2 = this.p2Map[this.p2Position.i * 2 + this.p2Position.j];
        if (!p2.destroyed)this.ctx.drawImage(this.bunkerSS,
          this.bunkerImgSize*4, 0, this.bunkerImgSize, this.bunkerImgSize,
           p2.x, p2.y, p2.w, p2.h)
      }


      this.now = Date.now();
      if (this.now - this.then > 100) {
        this.then = this.now;
        
        
        if (this.asteroidY > 0) this.actx.clearRect(0, 0, this.cWidth, this.cHeight)
        this.actx.drawImage(this.asteroidSS,
        this.asteroidSize*this.asteroidJ, 0, this.asteroidSize, this.asteroidSize,
        this.asteroidX, this.asteroidY, this.asteroidSize, this.asteroidSize )
        this.asteroidJ++;

        if (this.asteroidJ > 3) this.asteroidJ = 0;

      }
      
      window.requestAnimationFrame(this.animate);
    },
  },


  created() {
    
    this.$nextTick(() => {
      this.asteroidSS.src = require("../assets/boltSpriteSheetV.png");
      this.bunkerSS.src = require("../assets/BunkerSS.png");
      this.explosionSS.src= require("../assets/explosion.png")
      this.backgroundSS.src = require("../assets/gbackground.png");
      

      Promise.all(Array.from([this.asteroidSS, this.bunkerSS, this.explosionSS, this.backgroundSS]).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        console.log('images finished loading');
        this.socketinit();
        this.exploasionImageSize = this.explosionSS.width/18;
        this.bunkerImgSize = this.bunkerSS.width/8;
        this.init();
        
    });
    });
  },

  mixins: [
    mapMixins,
    socketMixins,
    eventHandlerMixins,
    renderWSmixins,
    connectionRelatedMixins,
    cellMixins,
  ],
};
</script>

<style scoped>
.game-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
}

.asteroid-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none; 
}

.contoller {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  bottom: 2vh;
}

button {
  background: rgb(0, 191, 255);
  border: none;
  padding: 1rem 2rem;
  margin: 0 1rem;
}
.instruction-wrapper {
  position: relative;
}

button:disabled {
  background-color: lightgray ;
}

.gameOver {
  position: absolute;
  width: 100vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.center-div {
  padding: 0 5rem;
  display: flex;
  flex-direction: column;
  
  align-items: center;
  background: hsl(0 0% 100% / 0.1);
  backdrop-filter: blur(1rem);
  height: 50vh;
  justify-content: space-around;
}

.instruction-text {
  padding: 1rem;
  width: 40%;
  position: absolute;
  top: 2%;
  left: 30%;
  color: rgb(145, 145, 145);
  font-size: 1rem;
  font-weight: thin;
  text-align: center;
}

.winText {
  font-size: 2rem;
  color: white;
}

@media (max-width: 700px) {
  .center-div {
    padding: 1rem;
  }
  .game-outer {
    padding: 2rem;
  }

  .winText {
    font-size: 1.5rem;
  }

  .contoller > button {
    margin: 0 0.25rem;
    padding: 0.3rem 1rem;

  }
  
  .instruction-text {
    top: 50%;
    left: 0;
    font-size: 0.75rem;
    font-weight: thin;
    text-align: left;
  }

}

</style>
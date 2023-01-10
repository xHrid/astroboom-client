<template>
  <div>
    <div class="banner-container">
      <div class="hero-center">
        <div class="hero-text">
          <div>A 1v1 stratagy based game</div>
          <h1>Astroboom</h1>
        </div>
        <div class="button-wrapper">
          <router-link to= "lobby" class="play-button">
            PLAY GAME
          </router-link>
        </div>
      </div>
    </div>
    <canvas ref="m-canvas"></canvas>
    <div class="about" >
      <div>
        <h2>WHAT IS THIS?</h2>
        <p>
          "A game where you are having an astronomical battle, with another warrior. You both have control of asteroids and can destroy anything with them. you have to find and destroy your opponent before they do. stay hidden in your bunkers and outsmart your opponent to win the match. let's dive in and have a look!"
        </p>
      </div>
    </div>
    <HowToPlay id="howtoplay"></HowToPlay>
  </div>
</template>

<script>
// @ is an alias to /src

import HowToPlay from "@/components/howtoplay.component.vue"

export default {
  name: 'HomeView',
  data() {
    return {
      canvas: null,
      ctx: null,
      meteorSpriteSheet: new Image(),

      j : 0,
      sWidth: 0,
      sHeight: 0,

      meteorAngle: 200,
      dTheta : 70/window.innerHeight, 
      dScale: 1/window.innerHeight,
      meteorX : 0,
      meteorY: 0,

      meteorTransform: "rotate(180deg)",

      meteorXOriginal: 0,
      meteorDistance: 0,

      now: 0,
      then: 0

    }
  },
  components: {
    HowToPlay, 
  },
  methods:{

    init() {
    this.canvas = this.$refs["m-canvas"];
    this.ctx = this.canvas.getContext("2d");
    this.sWidth = this.meteorSpriteSheet.width/4;
    this.sHeight = this.meteorSpriteSheet.height;

    this.canvas.width = this.sWidth/2;
    this.canvas.height = this.sHeight/2;

    this.meteorXOriginal = this.canvas.getBoundingClientRect().right;

    this.meteorDistance = (window.innerWidth - this.meteorXOriginal - window.innerWidth/10)/window.innerHeight;

    this.animate();
  },
  
  animate() {

    this.now = Date.now();
    let scale = window.scrollY < window.innerHeight ? 1 + this.dScale*window.scrollY : 1 + this.dScale*window.innerHeight
    if(window.scrollY < window.innerHeight)
      this.meteorTransform = `translateX(${this.meteorDistance*window.scrollY}px) rotate(${this.meteorAngle + this.dTheta * window.scrollY}deg) scale(${1  + this.dScale*window.scrollY})`
    
    if (this.now - this.then > 120) {
      this.then = this.now
      this.canvas.width = scale*this.sWidth/2;
      this.canvas.height = scale*this.sHeight/2;
      this.ctx.clearRect(0, 0, scale*this.sWidth/2, scale*this.sHeight/2);
      this.ctx.drawImage(
        this.meteorSpriteSheet,
        this.sWidth*this.j, 0, this.sWidth, this.sHeight,
        0, 0, scale*this.sWidth/2, scale*this.sHeight/2);

      this.j++;
      if (this.j >= 4) this.j = 0;
    }

    window.requestAnimationFrame(this.animate);
    
  },

  },

  created() {
    this.meteorSpriteSheet.src = require("@/assets/boltSpriteSheet.png")
    this.meteorSpriteSheet.onload = ()=>{
      this.init();
    }

  }
  
}
</script>

<style scoped>

  .banner-container{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 20vh;
    
    background-image: url("@/assets/hero_banner.png");
    background-size: cover;
    height: 100vh;
    margin: auto;
    background-position: center bottom;
  }

  .hero-center, .hero-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .hero-text > h1 {
    color: white;
    font-size: 5rem;
    margin: 1.5rem 0;
  }

  .hero-center * {
    color: white;
    font-weight: bold;
  }

  .button-wrapper {
    padding: 1.2rem 0.5rem;
    border: 2px solid white;
  }

  h2 {
    top: 0;
    left: 1rem;
    font-family: Oswald;
    font-size: 5rem;
    color: rgba(216, 100, 106, 0.799);
  }

  .about {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100vh;
    z-index: 2;
    background-image: url(../assets/aboutBg.png) ;
    background-size: cover ;
    background-position: center ;
  }
  
  .play-button {
    position: relative;
    z-index: 10;
  }

  canvas {
    position: fixed;
    top: 10%;
    left: 30%;
    transform: v-bind(meteorTransform);
    
  }

  .about p {
    font-family: roboto;
    max-width: 60vw;
    font-size: 1.5rem;
    font-weight: 400;
    color: white;
    padding: 1rem;
    backdrop-filter: blur(1.5rem);
  }

  
  @media (max-width: 800px) {
    .banner-container {
      background-position: 30% bottom;
    }
    .hero-text{
      flex-direction: column-reverse;
      margin-bottom: 20vh;
      font-size: 1.2rem;
    }
    .hero-text > h1{
      margin: 0;
      margin-bottom: 1rem ;
      font-size: 2.5rem;
    }
    .hero-text div {
      font-weight: normal;
    }

    h2 {
      font-size: 3rem;
    }

    .about p {
      font-size: 1rem;
    }

  }


</style>

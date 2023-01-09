<template>
  <div id="app">
    <button @click="navHandler"
      class="mobile-nav-toggle"
      aria-controls="nav-container"
      :aria-expanded="navExpanded">
      <span class="sr-only">Menu</span>
    </button>
    <div id="nav-container" :class="navVisible">
      <div>
        <router-link to="/">Home</router-link>
        <router-link to="/leaderboard" >Leaderboard</router-link>
        <router-link to="/lobby">Play Game</router-link>
      </div>
      <div class="a-login">
        <router-link v-if="!isAuthenticated" to="/login">Login | Register</router-link>
        <router-link v-if="isAuthenticated"  to="/me">Hi, {{ name }} </router-link>
        <a v-if="isAuthenticated"  href="/" @click="logout">Logout</a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return{
        navVisible: "",
        navExpanded: "false"
      }
    },
    computed: {
    name() {
      return this.$store.state.user.name;
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated
    },
  },
  methods: {
    logout() {
      this.$store.commit("logout");
    },
    navHandler() {
      if(this.navVisible == ""){
        this.navVisible = "nav-visible";
        this.navExpanded= "true";
      }
      else{
        this.navVisible = "";
        this.navExpanded= "false";
      }

    }
  },
  }
</script>

<style>
  @import "../public/css/style.css";
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Roboto:wght@100;400;700;900&display=swap');

  body{
    background-color: rgb(245, 253, 255);
  }

  #nav-container{
    position: absolute;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    padding: 0 5rem;
    font-size: 1rem;
    width: 100%;
    background: hsl(0 0% 100% / 0.1);
    backdrop-filter: blur(2rem);
  }

  #nav-container a {
    display: inline-block;
    padding: 1rem;
    color: rgb(0, 32, 19);
  }

  #nav-container a:hover {
    color: rgb(25,49,51);
    background: rgb(0, 191, 255);
  }

  .mobile-nav-toggle {
    display: none;
  }

  @media (max-width: 45rem) {

    .mobile-nav-toggle {
      background: url("../src/assets/hamburger.png");
      background-repeat: no-repeat;
      border: none;
      display: block;
      position: absolute;
      z-index: 9999;
      width: 2rem;
      aspect-ratio: 1;
      top: 2rem;
      right: 2rem;

    }

    .mobile-nav-toggle[aria-expanded="true"] {
      background: url("../src/assets/nav-closed.png");
      background-repeat: no-repeat;


    }
    
    #nav-container.nav-visible {
      transform: translateX(0%);
    }
    
    #nav-container {
      flex-direction: column;
      position: fixed;
      inset: 0 0 0 40%;
      padding: min(30vh, 10rem) 2rem;
      justify-content: space-between;
      transform: translateX(100%);
      transition: transform 350ms ease-out;
    }

    
    #nav-container > * {
      display: flex;
      flex-direction: column;
    }
  }

</style>

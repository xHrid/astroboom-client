<template>
  <div class="outer">
    <section class="profileSection" >
        <div class="profilePicContainer" >
            <div class="profilePicture">
            </div>
        </div>
        <div class="profileDetails">
            <div>Name:</div><div>{{name}}</div>
            <div>Email:</div><div>{{email}}</div>
            <div>Wins:</div><div>{{wins}}</div>
            <div>Points:</div><div>{{points}}</div>
        </div>
    </section>

  </div>
</template>

<script>

export default {

  computed: {
    name() {
      return this.$store.state.user.name;
    },
    wins() {
      return this.$store.state.user.wins;
    },
    points() {
      return this.$store.state.user.points;
    },
    email() {
      return this.$store.state.user.email
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },

  methods: {
    logout() {
      this.$store.commit("logout");
    }
  }
};
</script>

<style scoped>

  .outer {
    padding: 4rem 2rem;
  }

  .profileSection{
      display: grid;
      grid-template-columns: 30% 60%;
      padding: 3rem;
      background: rgb(222, 222, 222);
  }

  .profilePicContainer {
      display: flex;
      justify-content: center;
  }

  .profilePicture{
      width: 80%;
      max-width: 200px;
      aspect-ratio: 1;
      background: aquamarine;
  }

  .profileDetails {
    display: grid;
    grid-template-columns: max-content 60% ;
  }

  @media (max-width: 700px) {
    .profileSection {
      grid-template-columns: 30% 60%;
      padding: 3rem 0.5rem;
    }
    .profileDetails *{
      font-size: 0.8rem;
    }
  }

</style>
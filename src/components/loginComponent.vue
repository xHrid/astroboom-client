<template>
    <div class="container">
      <div class="">
        <div class="inner">
          <form
            class=""
            style=""
            @submit.prevent="loginUser"
          >
            <input
              type="text"
              id="email"
              class=""
              placeholder="Email"
              v-model="login.email"
            />
            <!-- Password -->
            <input
              type="password"
              id="password"
              class=""
              placeholder="Password"
              v-model="login.password"
            />
            <p>
              Dont have an account??<router-link class="ch" to="/register"
                >click here</router-link
              >
            </p>
            <!-- Sign in button -->
            <center>
              <button class="play-button" type="submit">
                Sign in
              </button>
            </center>
          </form>
        </div>
      </div>
    </div>
  </template>
  <script>
  import VueJwtDecode from "vue-jwt-decode";
  export default {
    data() {
      return {
        login: {
          email: "",
          password: ""
        }
      };
    },

    computed: {
      user() {
        return this.$store.state.user;
      },
      authed() {
        return this.$store.state.isAuthenticated
      }
    },

    methods: {

      async loginUser() {
        try {
          let response = await this.$http.post("/user/login", this.login);
          let token = response.data.token;
          
          if (token) {

            let decodedUser = VueJwtDecode.decode(token);
            this.$store.commit("setUser", decodedUser)
            this.$store.commit("setToken", token);
            this.$store.commit("setStatus", true);

            console.log(this.user);
            console.log(this.authed)

            this.$swal("Success", "Login Successful", "success");
            this.$router.push("/");
          
          }
        } catch (err) {
          this.$swal("Error", "Something Went Wrong", "error");
          console.log(err.response);
        }
      }
    },
  };
  </script>

<style scoped>
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(../assets/galaxyBunker.png) ;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .inner {
    padding: 2rem;
    background: hsl(0 0% 100% / 0.1);
    backdrop-filter: blur(1rem);
  }

  form {
    display: flex;
    height: 100%;
    justify-content: center;
    flex-direction: column ;
  }

  form > input {
    margin-bottom: 1rem;
    padding: 0.75rem 1.75rem;
    border-radius: 5px;
    border: none;
  }

  p {
    color: white;
  }

  button {
    margin-top: 1rem;
    color: black;
    background-color:rgb(254,251,231) ;
  }
  .ch {
    color: rgb(255, 218, 162)
  }

</style>
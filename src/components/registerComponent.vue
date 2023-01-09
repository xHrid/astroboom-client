<template>
    <div class="container">
      <div class="outer">
        <div class="inner">
          <form
            @submit.prevent="registerUser"
          >
            <input
              type="text"
              id="name"
              class=""
              placeholder="Name"
              v-model="register.name"
              required
            />
            <input
              type="email"
              id="email"
              class=""
              placeholder="Email"
              v-model="register.email"
              required
            />
            <!-- Password -->
            <input
              type="password"
              id="password"
              class=""
              placeholder="Password"
              v-model="register.password"
            />
            <p>
              Already have an account?<router-link class="ch" to="/login"
                > click here</router-link
              >
              <!-- Sign in button -->
              <center>
                <button class="play-button" type="submit">
                  Sign in
                </button>
              </center>
            </p>
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
        register: {
          name: "",
          email: "",
          password: ""
        }
      };
    },
    methods: {
      async registerUser() {
      try {
        let response = await this.$http.post("/user/register", this.register);
        let token = response.data.token;

        if (token) {
          this.$store.commit("setToken", token);
          let decodedUser = VueJwtDecode.decode(token);
            this.$store.commit("setUser", decodedUser)
            this.$store.commit("setToken", token);
            this.$store.commit("setStatus", true);
          this.$router.push("/");
          this.$swal("Success", "Registration Was successful", "success");
        } else {
          this.$swal("Error", "Something Went Wrong", "error");
        }
      } catch (err) {
        let error = err.response;
        if (error.status == 409) {
          this.$swal("Error", error.data.message, "error");
        } else {
          this.$swal("Error", error.data.err.message, "error");
        }
      }
    }
    }
  };
  </script>

<style scoped>

  .container {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(../assets/loginBg.png);
    background-size: cover;
    background-position: center ;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center ;
    padding: 2rem;
  }


  .inner {
    display: flex;
  }

  form > input {
    margin-bottom: 1rem;
    padding: 0.75rem 1.75rem;
    border: none;
    
    background: hsl(0 0% 100% / 0.1);
    backdrop-filter: blur(1rem);
    
  }

  p {
    padding: 1rem;
    color: white;
  }

  .play-button {
    margin-top: 1.75rem;
    
  }

  .ch{
    color: rgb(255, 255, 255)
  }

</style>
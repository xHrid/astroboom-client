<template>
    <div>
        <div class="initButtons">
            <button @click="playRanked"> Play Ranked </button>
            <button @click="createLobby"> Create Match</button>
            <button @click="joinLobby"> Join Match</button>
            <input type="text" placeholder="Match Code" v-model="lobbyCode">
        </div>
    </div>
</template>

<script>
export default {
    name: "LobbyComponent",

    data() {
        return {
            lobbyCode: ""
        }
    },

    methods: {
        generateString() {
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for ( let i = 0; i < 8; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },

        playRanked() {
            this.$store.commit("setMode", 'r');
            this.$router.push("/game")
        },

        createLobby() {
            this.$store.commit("setLobbyCode", this.generateString());
            this.$store.commit("setMode", 'c');
            this.$router.push("/game")
        },

        joinLobby() {
            this.$store.commit("setLobbyCode", this.lobbyCode);
            this.$store.commit("setMode", 'j');
            this.$router.push("/game")
        },

        resetLobbyCode() {
            this.$store.commit("setLobbyCode", "");
        }

    },

    created() {
        this.resetLobbyCode();
    }
}

</script>

<style scoped>
   
    .initButtons{
        display: flex;
        flex-direction: column;
        padding: 5rem 1rem;
    }
    .initButtons > *{
        text-align: left;
        padding: 1rem;
        margin: 2px 1rem;
        width: min(20rem, 80vw);
        border: none;
        border-radius: 5px;
    }

    .initButtons>button {
        background: gold;
    }

</style>
<template>
    <div>
        <section class="rank-section">
            <playerRank
                v-for="player in players"
                :key="player._id"
                :rank="players.indexOf(player) + 1"
                :name="player.name"
                :points="player.points"/>
        </section>
    </div>
</template>

<script>

import playerRank from "@/components/playerrank.component.vue"

export default {
    name: "leaderBoard",
    data() {
        return {
            players : null,
        }
    },
    components: {
        playerRank
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

        async getAllUsers() {
            try {
                let response = await this.$http.get("/user/all");
                this.players = response.data;

            } catch (err) {
                this.$swal("Error", "Something Went Wrong", "error");
            }
        },

        logout() {
            this.$store.commit("logout");
        }

    },

    created() {
        this.getAllUsers();
    }
}
</script>

<style scoped >
    .rank-section{
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        align-items: center;
        padding: 5rem 10%;
    }
    
</style>
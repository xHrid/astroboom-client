<template>
    <div class="outer">
        <TurnBasedGameVue/>
    </div>
</template>

<script>
    import TurnBasedGameVue from '@/components/TurnBasedGame.vue';
    export default {
        components: {
            TurnBasedGameVue
        },

        computed: {
            id(){
                return this.$store.state.user.id;
            },
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
        },

    }
</script>

<style scoped>

    .outer {
        
        background: rgb(238, 247, 255);
    }

    h1 {
        position: relative 0 auto;
    }

</style>
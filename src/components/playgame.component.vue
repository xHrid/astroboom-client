<template>
  <div>
    <a
        id="play-game"
        class="play-button"
        href="/game">PlayGame
    </a>
  </div>
</template>

<script>

export default {
    name: "PlayGame"
}
</script>

<style scoped>
    div{
        display: flex;
        height: 500px;
        justify-content: center;
        align-items: center;
        background: url("@/assets/game-bg.png");
    }

    .play-button{
        padding: 20px 50px;
        border: none;
        border-radius: 20px;
        font-size: 20px;
        background: rgb(137, 247, 240);
        text-decoration: none;
        color: rgb(25,49,51);
    }

    .play-button:hover{
        background: rgb(131, 255, 247);
    }

</style>
<template>
  <section>
    <ul>
      <li>{{ rank }}</li>
      <li>{{ name }}</li>
      <li class="points">{{ points }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "playerRank",
  props: ["rank", "name", "points"],
};
</script>

<style scoped>
section {
  align-items: center;
  justify-content: center;
  display: flex;
  height: 5rem;
  border-radius: 2rem;
  background: rgb(221, 221, 221);
  width: 80%;
  margin: 0.3rem;
}

ul {
  display: flex;
  position: relative;
  padding: 0;
  width: 80%;
  list-style: none;
  margin-bottom: 0;
}

li {
  font-size: 1.3rem;
  margin-right: 1rem;
}

.points {
  position: absolute;
  right: 0;
  margin: 0;
}

@media (max-width: 700px){
  section {
    width: 100%;
    height: 3rem;
  }

  li {
      font-size: 1rem;
  }
}
</style>
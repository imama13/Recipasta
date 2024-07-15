<template><head><link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+NSW:wght@100..400&display=swap" rel="stylesheet"></head>
  <div class="recipe-detail" v-if="recipe">
    <div class="header">
      <h1>{{ recipe.title }}</h1>
      <div class="image-container">
        <img :src="recipe.pictureUrl" alt="Recipe Image" />
      </div>
    </div>
    <div class="info">
      <p class="cooking-time">Cooking time: {{ recipe.cookingTime }}</p>
      <ul class="ingredients">
      <h2>Ingredients</h2>
      <li v-for="ingredient in splitIngredients(recipe.ingredients)" :key="ingredient">{{ ingredient.trim() }}</li>
    </ul>
    </div>
    <div class= "des">
    <h2>Description</h2>
    <p>{{ recipe.description }}</p>
  </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();
const recipeId = route.params.id;
const recipe = ref(null);

onMounted(() => {
  fetchRecipe();
});

const fetchRecipe = async () => {
  try {
    const recipeData = await store.dispatch('fetchRecipe', recipeId);
    recipe.value = recipeData;
  } catch (error) {
    console.error('Error fetching recipe:', error);
  }
};

const splitIngredients = (ingredients) => {
  return ingredients.split(/[\n,]+/).filter(ingredient => ingredient.trim() !== '');
};

</script>

<style scoped>
.recipe-detail {
  padding: 50px;
  font-size: 20px;
  height: calc(100vh - 180px);
  color: white;
  font-family: "Domine", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header h1 {
  font-family: "Playwrite AU NSW", cursive;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 40px;
  font-style: normal;
  margin-bottom: 50px;
}

.image-container {
  margin: 20px;
}

.image-container img {
  height: 400px;
  width: auto;
}

.info {
  display: flex;
  flex-direction: column;
  margin-top: -350px; /* Adjust this value to move the info up */
  margin-left: 20px; /* Adjust this value to position the info under the title */
}

.cooking-time {
  margin-top: 20px; /* Adjust this value to control spacing between elements */
}

.ingredients {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.ingredients li {
  margin-bottom: 10px;
}

.ingredients li:before {
  content: "\2022";
  margin-right: 10px;
  color: #666;
}

.des {
  margin-top: 20px;
  padding-bottom: 30px;
  margin-left: 20px;
  line-height: 30px;
}
</style>

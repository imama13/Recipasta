<template>
  <div class="main-page">
    <h1>Recipes</h1>
    <div class="recipe-list">
      <div v-if="recipes.length === 0">
        <p>No recipes found.</p>
      </div>
      <div v-else>
        <div
          v-for="recipe in recipes"
          :key="recipe.id"
          class="recipe-card"
        >
          <img :src="recipe.pictureUrl" alt="Recipe Image" />
          <h2 @click="viewRecipe(recipe.id)">{{ recipe.title }}</h2>
          <p>Cooking time: {{ recipe.cookingTime }}</p>
          <button @click="editRecipe(recipe.id)">Edit Recipe</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const recipes = ref([]);
const router = useRouter();
const store = useStore();


onMounted(async () => {
  try {
    await store.dispatch('fetchRecipes'); // Ensure this action name matches your Vuex setup
    recipes.value = store.getters.recipes; // Assuming 'recipes' getter returns the fetched recipes
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
});

const viewRecipe = (id) => {
  router.push(`/dashboard/recipe/${id}`);
};

const editRecipe = (id) => {
  router.push(`/dashboard/edit-recipe/${id}`);
};

//onMounted(fetchRecipes);
</script>

<style scoped>
.main-page {
  padding: 20px;
  margin-top: 70px;
}

.recipe-list {
  display: flex;
  flex-wrap: wrap;
}

.recipe-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
  width: 200px;
  text-align: center;
}

.recipe-card img {
  width: 100%;
  height: auto;
}
</style>

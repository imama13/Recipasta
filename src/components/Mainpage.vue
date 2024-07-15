<template>
  <head><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+NSW:wght@100..400&display=swap" rel="stylesheet"></head>
  <div class="main-page">
    <h1>Welome To Recipasta!</h1>
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
          <div class="recipe-details">
            <h2 @click="viewRecipe(recipe.id)">{{ recipe.title }}</h2>
            <p><strong>Cooking time:</strong> {{ recipe.cookingTime }}</p>
            <p class="ingredients"><strong>Ingredients: </strong>{{ recipe.ingredients.slice(0, 40) + '...' }}</p>
            <p class="description"><strong>Description: </strong>{{ recipe.description.slice(0, 70) + '...' }}</p>
            <button v-if="recipe.userId === user.id" @click="editRecipe(recipe.id)">Edit Recipe</button>
          </div>
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
const user = store.getters.user;

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
</script>

<style scoped>
.main-page {
  padding: 20px;
  margin-top: 70px;
  height: calc(100vh - 90px);
  font-size: 18px;
  color: #E9EFFF;
}


.main-page h1 {
  text-align: center;
  margin-top: 40px;
  margin-bottom: -5px;
  font-family: "Playwrite AU NSW", cursive;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 40px;
  font-style: normal;
}


.recipe-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-right: 125px;
}

.recipe-card {
  position: relative;
  border: 0px;
  box-shadow: rgba(87, 94, 98, 0.466) 0px 2px 4px 0px, rgba(47, 55, 58, 0.466) 0px 2px 16px 0px;
  padding: 10px;
  margin: 50px;
  width: 100%;
  height: 250px;
  display: flex;
  gap: 20px;
  border-radius: 15px;
}

.recipe-card img {
  max-width: 40%;
  max-height: 90%;
  width: auto;
  height: auto;
  object-fit: cover;
  align-self: center;
  padding-left: 20px;
}

.recipe-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
  margin-left: 20px;
  padding: 10px; /* Add some padding to the recipe details */
  overflow-y: auto; /* Add this line */
}

.recipe-details h2,
.recipe-details p {
  margin: 5px 0; /* Add some margin between text fields */
  font-family: "Domine", serif;
}

.recipe-details p {
  margin-top: 10px;
  margin-left: 10px;
  font-family: "Domine", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.ingredients,
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recipe-card button {
  align-self: flex-end;
  margin-top: auto; /* Push the button to the bottom */
}
</style>
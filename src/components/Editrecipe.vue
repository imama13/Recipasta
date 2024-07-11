<template>
  <div class="edit-recipe">
    <h1>Edit Recipe</h1>
    <form @submit.prevent="updateRecipe">
      <p>Title: <input v-model="title" type="text"  /></p>
      <p>Picture URL: <input v-model="pictureUrl" type="text" /></p>
      <p>Cooking Time: <input v-model="cookingTime" type="text"  /></p>
      <p>Ingredients: <textarea v-model="ingredients" ></textarea></p>
      <p>Recipe: <textarea v-model="description" ></textarea></p>
      <button type="submit">Update Recipe</button>
      <button type="button" @click="deleteRecipe">Delete Recipe</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const title = ref('');
const pictureUrl = ref('');
const cookingTime = ref('');
const ingredients = ref('');
const description = ref('');
const message = ref('');

const router = useRouter();
const route = useRoute();
const store = useStore();
const recipeId = route.params.id;

const fetchRecipe = async () => {
  try {
    const recipe = await store.dispatch('fetchRecipe', recipeId);
    title.value = recipe.title;
    pictureUrl.value = recipe.pictureUrl;
    cookingTime.value = recipe.cookingTime;
    ingredients.value = recipe.ingredients;
    description.value = recipe.description;
  } catch (error) {
    console.error('Error fetching recipe:', error);
  }
};

const updateRecipe = async () => {
  try {
    await store.dispatch('updateRecipe', {
      id: recipeId,
      title: title.value,
      pictureUrl: pictureUrl.value,
      cookingTime: cookingTime.value,
      ingredients: ingredients.value,
      description: description.value
    });
    message.value = 'Recipe updated successfully';
    setTimeout(() => {
      message.value = '';
      router.push('/dashboard');
    }, 2000);
  } catch (error) {
    console.error('Error updating recipe:', error);
  }
};

const deleteRecipe = async () => {
  try {
    await store.dispatch('deleteRecipe', recipeId);
    message.value = 'Recipe deleted successfully';
    setTimeout(() => {
      message.value = '';
      router.push('/dashboard');
    }, 2000);
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
};

onMounted(fetchRecipe);
</script>

<style scoped>
.edit-recipe {
  padding: 20px;
}

form p {
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  height: 100px;
}

.message {
  margin-top: 20px;
  color: green;
}
</style>

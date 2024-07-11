<template>
  <div class="post-recipe">
    <h1>Post a Recipe</h1>
    <form @submit.prevent="submitRecipe">
      <p>Title: <input v-model="title" type="text" required /></p>
      <p>Picture URL: <input v-model="pictureUrl" type="text" /></p>
      <p>Cooking Time: <input v-model="cookingTime" type="text" required /></p>
      <p>Ingredients: <textarea v-model="ingredients" required></textarea></p>
      <p>Recipe: <textarea v-model="description" required></textarea></p>
      <button type="submit">Submit Recipe</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const title = ref('');
const pictureUrl = ref('');
const cookingTime = ref('');
const ingredients = ref('');
const description = ref('');

const router = useRouter();
const store = useStore();

const submitRecipe = async () => {
  try {
    await store.dispatch('postRecipe', {
      title: title.value,
      pictureUrl: pictureUrl.value,
      cookingTime: cookingTime.value,
      ingredients: ingredients.value,
      description: description.value,
      //userId: store.state.user.id,
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Error posting recipe:', error);
  }
};
</script>

<style scoped>
.post-recipe {
  padding: 20px;
}

form p {
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  height: 100px;
}
</style>

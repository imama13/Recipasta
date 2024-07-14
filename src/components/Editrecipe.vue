<template>
  <div class="edit-recipe">
    <h1>Edit Recipe</h1>
    <form @submit.prevent="updateRecipe">
      <p>Title: <input v-model="title" type="text" /></p>
      <p>Picture URL: <input v-model="pictureUrl" type="text" /></p>
      <p>Or Upload New Picture: <input type="file" @change="handleFileUpload" /></p>
      <p>Cooking Time: <input v-model="cookingTime" type="text" /></p>
      <p>Ingredients: <textarea v-model="ingredients"></textarea></p>
      <p>Recipe: <textarea v-model="description"></textarea></p>
      <button type="submit">Update Recipe</button>
      <button type="button" @click="confirmDeleteRecipe" class="delete-button">Delete Recipe</button>
    </form>
    <div v-if="message" class="popup">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const router = useRouter();
const route = useRoute();
const store = useStore();
const recipeId = route.params.id;

const title = ref('');
const pictureUrl = ref('');
const cookingTime = ref('');
const ingredients = ref('');
const description = ref('');
const message = ref('');
const file = ref(null);

onMounted(() => {
  fetchRecipe();
});

const fetchRecipe = async () => {
  try {
    const recipe = await store.dispatch('fetchRecipe', recipeId);
    title.value = recipe.title || '';
    pictureUrl.value = recipe.pictureUrl || '';
    cookingTime.value = recipe.cookingTime || '';
    ingredients.value = recipe.ingredients || '';
    description.value = recipe.description || '';
  } catch (error) {
    console.error('Error fetching recipe:', error);
  }
};

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

const uploadFile = async () => {
  if (file.value) {
    const storage = getStorage();
    const storageReference = storageRef(storage, `recipes/${Date.now()}_${file.value.name}`);
    await uploadBytes(storageReference, file.value);
    return await getDownloadURL(storageReference);
  }
  return pictureUrl.value;
};

const updateRecipe = async () => {
  try {
    const newPictureUrl = await uploadFile();
    const updatedRecipe = {
      id: recipeId,
      title: title.value,
      pictureUrl: newPictureUrl,
      cookingTime: cookingTime.value,
      ingredients: ingredients.value,
      description: description.value
    };

    await store.dispatch('updateRecipe', updatedRecipe);
    message.value = 'Recipe updated successfully';
    setTimeout(() => {
      message.value = '';
      router.push('/dashboard');
    }, 2000);
  } catch (error) {
    console.error('Error updating recipe:', error);
    message.value = 'Recipe update failed';
    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
};

const confirmDeleteRecipe = () => {
  if (confirm('Are you sure you want to delete this recipe?')) {
    deleteRecipe();
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
    message.value = 'Recipe deletion failed';
    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
};
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

.popup {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.delete-button {
  background-color: red;
  color: white;
  padding: 9px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.delete-button:hover {
  background-color: darkred;
}
</style>

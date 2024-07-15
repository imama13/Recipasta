<template>
  <head><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+NSW:wght@100..400&display=swap" rel="stylesheet"></head>
  <div class="edit-recipe">
    <h1>Edit Recipe</h1>
    <form @submit.prevent="updateRecipe">
      <div class="form-group">
        <label>Title:</label>
        <input v-model="title" type="text" />
      </div>
      <div class="form-group">
        <label>Picture URL:</label>
        <input v-model="pictureUrl" type="text" />
      </div>
      <div class="form-group">
        <label>Or Upload New Picture:</label>
        <input type="file" @change="handleFileUpload" />
      </div>
      <div class="form-group">
        <label>Cooking Time:</label>
        <input v-model="cookingTime" type="text" />
      </div>
      <div class="form-group">
        <label>Ingredients:</label>
        <textarea v-model="ingredients"></textarea>
      </div>
      <div class="form-group">
        <label>Recipe:</label>
        <textarea v-model="description"></textarea>
      </div>
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
  color: white;
  margin-top: 400px;
}

.edit-recipe h1 {
  margin-left: -20px;
  margin-top: 30px;
  margin-bottom: 25px;
  font-family: "Playwrite AU NSW", cursive;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 40px;
  font-style: normal;
}

.form-group {
  margin-bottom: 15px;
  margin-left: -480px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: white;
}

.form-group input[type="text"],
.form-group textarea,
.form-group input[type="file"] {
  width: 700px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group textarea {
  height: 150px;
  resize: vertical;
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
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: -32px;
  margin-bottom: 30px;
  margin-right: 950px;
}

.delete-button:hover {
  background-color: darkred;
}
</style>

<template>
  <div class="post-recipe">
    <h1>Post a Recipe</h1>
    <form @submit.prevent="submitRecipe">
      <p>Title: <input v-model="title" type="text" required /></p>
      <p>Picture: <input type="file" @change="handleFileUpload" /></p>
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
import { storage } from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const title = ref('');
const file = ref(null);
const cookingTime = ref('');
const ingredients = ref('');
const description = ref('');
const pictureUrl = ref('');

const router = useRouter();
const store = useStore();
//const storage = getStorage();

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

const uploadFileToFirebase = async (file) => {
  const storageReference = storageRef(storage, `recipes/${Date.now()}_${file.name}`);
  await uploadBytes(storageReference, file);
  const url = await getDownloadURL(storageReference);
  return url;
};

const submitRecipe = async () => {
  try {
    if (file.value) {
      pictureUrl.value = await uploadFileToFirebase(file.value);
    }

    await store.dispatch('postRecipe', {
      title: title.value,
      pictureUrl: pictureUrl.value,
      cookingTime: cookingTime.value,
      ingredients: ingredients.value,
      description: description.value,
      userId: store.state.user.id,
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
  height: calc(100vh - 120px);
  color: white;
}

form p {
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  height: 100px;
}
</style>

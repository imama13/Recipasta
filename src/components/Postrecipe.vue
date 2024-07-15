<template>
  <head><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+NSW:wght@100..400&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap" rel="stylesheet">
</head>
  <div class="post-recipe">
    <h1>Post a Recipe</h1>
    <form @submit.prevent="submitRecipe" class="recipe-form">
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
  text-align: left; /* add this to left-justify the content */
  margin-left: -450px;
}


.recipe-form { /* New class name */
  text-align: left;
  color: white;
}

.post-recipe h1 {
  margin-top: 60px;
  margin-left: 90px;
  font-family: "Playwrite AU NSW", cursive;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 40px;
  font-style: normal;
}

.post-recipe recipe-form p {
  margin-bottom: 10px;
  font-family: "Roboto Serif", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 20px;
  font-style: normal;
  color: rgb(230, 240, 247);
}

input[type="text"], textarea {
  width: 400px; /* increase the width of the text fields */
  padding: 10px; /* add some padding to the text fields */
  border: 1px solid #ccc; /* add a border to the text fields */
  border-radius: 4px; /* add a border radius to the text fields */
  margin-top: 10px;
}

textarea {
  height: 150px; /* increase the height of the textarea */
  resize: vertical; /* allow the textarea to be resized vertically */
}

input[type="text"], textarea {
  display: block; /* add this to make the text fields take up the full width */
  width: 700px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.left form button {
  margin-bottom: 30px;
  margin-top: 10px;
  margin-left: 500px;
}

</style>
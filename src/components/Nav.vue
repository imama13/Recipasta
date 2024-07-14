<template>
  <nav class="navbar">
    <div class="spacer"></div>
    <button @click="goToMainPage">Home</button>
    <button @click="navigateToPostRecipe">Post a Recipe</button>
    <button @click="goToEditProfile">Edit Profile</button>
    <button @click="logout">Logout</button>
  </nav>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const goToMainPage = () => {
  router.push('/dashboard');
};

const navigateToPostRecipe = () => {
  router.push('/dashboard/post-recipe');
};

const goToEditProfile = () => {
  router.push('/dashboard/edit-profile');
};

const logout = () => {
  store.dispatch('logout');
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #305f8e;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0px; /* Optional: add padding to the left and right */
  box-shadow: 0 2px 5px rgba(58, 47, 47, 0.1); /* Optional: add a shadow for a better look */
  z-index: 10;
}

.spacer {
  flex: 0.7; /* Takes up remaining space to push buttons to the right */
}

.navbar button {
  font-family: verdana, sans-serif;
  font-weight: 600;
  font-size:medium;
  background-color: #3e77b000;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 4px;
  padding: 5px 15px; /* Adjust padding for smaller button size */
  cursor: pointer;
}

.navbar button:hover {
  background-color: #043f7ad3;
}
</style>

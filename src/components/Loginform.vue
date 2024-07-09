<template>
  <div class="page">
    <div class="form-container">
      <h1>Log In!</h1>
      <br/>
      <form @submit.prevent="login">
        <p>Username: <input v-model="username" type="text" required></p>
        <p>Password: <input v-model="password" type="password" required></p>
        <button type="submit">Log in</button>
      </form>
      <br/>
      <p>Create new account?
      <router-link to="/signup">Sign Up</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import '@/assets/forms.css';

const username = ref('');
const password = ref('');

const router = useRouter();
const store = useStore();

const login = async () => {
  try {
    await store.dispatch('login', { username: username.value, password: password.value });
    router.push('/dashboard');
  } catch (error) {
    console.error('Error logging in:', error);
    showMessage('Invalid credentials or login failed.');
  }
};

const showMessage = (message) => {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerText = message;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 3000);
};
</script>

<style scoped>
/* Add your styles here */

.popup {
  background-color: #ff6666;
  color: white;
  padding: 10px;
  border-radius: 4px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>

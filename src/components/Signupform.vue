<template>
  <div class="page">
    <div class="form-container">
      <h1>SIGN UP!</h1>
      <form @submit.prevent="signup">
        <h3>Create New Account</h3>
        <br/>
        <p>Username: <input v-model="username" type="text" required></p>
        <p>Password: <input v-model="password" type="password" required></p>
        <p>Email: <input v-model="email" type="email" required></p>
        <p>Date of Birth: <input v-model="dob" type="date" required></p>
        <button type="submit">Sign up</button>
      </form>
      <br/>
      <p>Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
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
const email = ref('');
const dob = ref('');

const router = useRouter();
const store = useStore();

const signup = async () => {
  try {
    await store.dispatch('signup', {
      username: username.value,
      password: password.value,
      email: email.value,
      dob: dob.value
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Error signing up:', error);
    showMessage(error.message);
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

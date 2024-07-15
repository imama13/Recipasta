<template>
  <div class="page">
    <div class="form-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>SIGN UP!</h1>
      <form @submit.prevent="signup">
        <h3>Create New Account</h3>
        <br />
        <p>Username: <input v-model="username" type="text" required /></p>
        <p>Password: <input v-model="password" type="password" required /></p>
        <p>Email: <input v-model="email" type="email" required /></p>
        <p>Date of Birth: <input v-model="dob" type="date" required /></p>
        <button type="submit">Sign up</button>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
      </form>
      <br />
      
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
    if (!validatePassword(password.value)) {
      showMessage('Password must be at least 5 characters long and include at least one number.');
      return;
    }
    await store.dispatch('signup', {
      username: username.value,
      password: password.value,
      email: email.value,
      dob: dob.value,
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Error signing up:', error);
    showMessage(error.message);
  }
};

const validatePassword = (password) => {
  const regex = /^(?=.*\d).{5,}$/;
  return regex.test(password);
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
  background-color: #a08181;
  color: white;
  padding: 10px;
  border-radius: 4px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.form-container {
  padding: 10px 30px; /* Adjusted padding to reduce height */
  line-height: 1.2; /* Adjusted line-height to bring content closer vertically */
  width: 500px;
  max-height: 630px; /* Set maximum height */
  color: #00113A;
}

form input {
  margin-bottom: 8px; /* Reduced margin-bottom to bring content closer */
}

form button {
  margin-top: -8px; /* Optional: Add some margin-top if buttons are too close to inputs */
}

.button-link {
  margin-top: 10px; /* Space between the login link button and the form button */
  padding: 7px 20px;
  background-color: #007BFF;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.button-link:hover {
  background-color: #0056b3;
}


</style>

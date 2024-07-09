<template>
    <div class="page">
      <div class="form-container">
        <h1>Edit Profile</h1>
        <form @submit.prevent="updateProfile">
          <p>Username: <input v-model="username" type="text"></p>
          <p>Password: <input v-model="password" type="password" placeholder="Leave blank to keep current password"></p>
          <p>Email: <input v-model="email" type="email"></p>
          <p>Date of Birth: <input v-model="dob" type="date"></p>
          <button type="submit">Update Profile</button>
          <button type="button" @click="confirmDeleteAccount" class="delete-button">Delete Account</button>
        </form>
      </div>
      <div v-if="message" class="popup">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import '@/assets/forms.css';
  
  const username = ref('');
  const password = ref('');
  const email = ref('');
  const dob = ref('');
  const message = ref('');
  
  const router = useRouter();
  const store = useStore();
  
  onMounted(() => {
    const currentUser = store.getters.user;
    if (currentUser) {
      username.value = currentUser.username || '';
      email.value = currentUser.email || '';
      dob.value = currentUser.dob || '';
    }
  });
  
  const updateProfile = async () => {
    try {
      const updatedUser = {};
      if (username.value) updatedUser.username = username.value;
      if (password.value) updatedUser.password = password.value;
      if (email.value) updatedUser.email = email.value;
      if (dob.value) updatedUser.dob = dob.value;
  
      await store.dispatch('updateUser', updatedUser);
      message.value = 'Profile updated successfully';
      setTimeout(() => {
        message.value = '';
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.value = 'Profile update failed';
      setTimeout(() => {
        message.value = '';
      }, 3000);
    }
  };
  
  const confirmDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account?')) {
      deleteAccount();
    }
  };
  
  const deleteAccount = async () => {
  try {
    const result = await store.dispatch('deleteAccount');
    if (result) {
      message.value = 'Account deleted successfully';
      setTimeout(() => {
        message.value = '';
        router.push('/login');
      }, 2000);
    } else {
      message.value = 'Account deletion failed';
      setTimeout(() => {
        message.value = '';
      }, 3000);
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    message.value = 'Account deletion failed';
    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
};
  </script>
  
  
  <style scoped>
  .page {
    margin-top: 70px;
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
  
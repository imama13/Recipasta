<template>
    <div class="recipe-detail">
      <h1>{{ recipe.title }}</h1>
      <img :src="recipe.pictureUrl" alt="Recipe Image" />
      <p>Cooking time: {{ recipe.cookingTime }}</p>
      <h3>Ingredients:</h3>
      <p>{{ recipe.ingredients }}</p>
      <h3>Recipe:</h3>
      <p>{{ recipe.description }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const recipe = ref({});
  const route = useRoute();
  const recipeId = route.params.id;
  
  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/${recipeId}`);
      recipe.value = response.data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };
  
  onMounted(() => {
    fetchRecipe();
  });
  </script>
  
  <style scoped>
  .recipe-detail {
    padding: 20px;
  }
  
  .recipe-detail img {
    width: 100%;
    height: auto;
  }
  </style>
  
import { createStore } from 'vuex';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    recipes: [],
    currentRecipe: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    setRecipes(state, recipes) {
      state.recipes = recipes;
    },
    setCurrentRecipe(state, recipe) {
      state.currentRecipe = recipe;
    },
    addRecipe(state, recipe) {
      state.recipes.push(recipe);
    },
    updateRecipe(state, updatedRecipe) {
      const index = state.recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
      if (index !== -1) {
        state.recipes.splice(index, 1, updatedRecipe);
      }
    },
    deleteRecipe(state, recipeId) {
      state.recipes = state.recipes.filter(recipe => recipe.id !== recipeId);
    },
  },
  actions: {
    async fetchUser({ commit }, username) {
      const response = await axios.get(`http://localhost:3000/users?username=${username}`);
      commit('setUser', response.data[0]);
    },
    async updateUser({ commit, state }, updatedUser) {
      const response = await axios.put(`http://localhost:3000/users/${state.user.id}`, {
        ...state.user,
        ...updatedUser,
      });
      commit('setUser', response.data);
    },
    async deleteAccount({ state, commit }) {
      try {
        await axios.delete(`http://localhost:3000/users/${state.user.id}`);
        commit('setUser', null);
        return true; // Indicate success
      } catch (error) {
        console.error('Error deleting account:', error);
        return false; // Indicate failure
      }
    },
    async signup({ commit }, userData) {
      try {
        const response = await axios.get('http://localhost:3000/users');
        const userExists = response.data.some(user => user.username === userData.username);

        if (userExists) {
          throw new Error('Username already taken. Please choose a different username.');
        }

        // Hash the password before sending it to the server
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const userResponse = await axios.post('http://localhost:3000/users', {
          ...userData,
          password: hashedPassword,
        });
        
        commit('setUser', userResponse.data);
        return userResponse.data;
      } catch (error) {
        throw error;
      }
    },
    async login({ commit }, { username, password }) {
      try {
        // Fetch user by username
        const response = await axios.get('http://localhost:3000/users');
        const user = response.data.find(user => user.username === username);
    
        if (!user) {
          throw new Error('Invalid credentials');
        }
    
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (passwordMatch) {
          commit('setUser', user);
          localStorage.setItem('userId', user.id);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
    
    logout({ commit }) {
      commit('setUser', null);
    },
    async fetchRecipes({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/recipes');
        console.log(response.data)
        commit('setRecipes', response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    },
    async fetchRecipe({ commit }, recipeId) {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/${recipeId}`);
        console.log(response.data)
        commit('setCurrentRecipe', response.data[0]);
        return response.data[0];
      } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }
    },
    
    async postRecipe({ commit, state }, recipeData) {
      try {
        const response = await axios.post('http://localhost:3000/recipes', {
          ...recipeData,
          userId: state.user.id
        });
        commit('addRecipe', response.data);
        return response.data;
      } catch (error) {
        console.error('Error posting recipe:', error);
        throw error;
      }
    },
  
    async updateRecipe({ commit, state }, updatedRecipe) {
      try {
        const recipeToUpdate = { ...state.currentRecipe, ...updatedRecipe };
        const response = await axios.put(`http://localhost:3000/recipes/${updatedRecipe.id}`, recipeToUpdate);
        commit('updateRecipe', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
      }
    },
  async deleteRecipe({ commit }, recipeId) {
    try {
      await axios.delete(`http://localhost:3000/recipes/${recipeId}`);
      commit('deleteRecipe', recipeId);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }
},
  getters: {
    user: state => state.user,
    isLoggedIn: state => !!state.user,
    recipes: state => state.recipes,
    currentRecipe: state => state.currentRecipe
  },
});

export default store;

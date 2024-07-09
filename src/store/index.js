import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
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

        const userResponse = await axios.post('http://localhost:3000/users', userData);
        commit('setUser', userResponse.data);
        return userResponse.data;
      } catch (error) {
        throw error;
      }
    },
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.get('http://localhost:3000/users');
        const user = response.data.find(user => user.username === username && user.password === password);
        if (user) {
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
    }
  },
  getters: {
    user: state => state.user,
    isLoggedIn: state => !!state.user,
  },
});

export default store;

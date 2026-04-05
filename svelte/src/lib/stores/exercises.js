import { writable, derived } from 'svelte/store';
import Fuse from 'fuse.js';

// Constants
export const PAGE_SIZE = 50;
export const EXERCISES_API_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

// Core stores
export const exercises = writable([]);
export const query = writable('');
export const currentPage = writable(0);
export const loading = writable(true);
export const error = writable(null);

// Search configuration
const SEARCH_OPTIONS = {
  keys: ['id', 'name', 'instructions'],
  threshold: 0.3,
  includeScore: true
};

// Derived stores
export const searchResults = derived(
  [exercises, query],
  ([$exercises, $query]) => {
    if (!$query.trim() || $query.length < 2) {
      return $exercises;
    }

    const fuse = new Fuse($exercises, SEARCH_OPTIONS);
    return fuse.search($query).map(result => result.item);
  }
);

export const paginatedResults = derived(
  [searchResults, currentPage],
  ([$searchResults, $currentPage]) => {
    const endIndex = ($currentPage + 1) * PAGE_SIZE;
    return $searchResults.slice(0, endIndex);
  }
);

export const totalPages = derived(
  [searchResults],
  ([$searchResults]) => Math.ceil($searchResults.length / PAGE_SIZE)
);

// Actions
export const exerciseActions = {
  async fetchExercises() {
    loading.set(true);
    error.set(null);
    
    try {
      const response = await fetch(EXERCISES_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      exercises.set(data);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
      error.set(err.message);
      exercises.set([]);
    } finally {
      loading.set(false);
    }
  },

  setQuery(searchQuery) {
    query.set(searchQuery);
    currentPage.set(0);
  },

  loadNextPage() {
    currentPage.update(page => page + 1);
  },

  reset() {
    query.set('');
    currentPage.set(0);
    error.set(null);
  }
};
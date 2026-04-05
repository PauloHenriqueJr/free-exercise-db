import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'savedExercises';

// Create store with initial value from localStorage
function createBookmarkStore() {
  const initialValue = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') 
    : [];

  const { subscribe, set, update } = writable(initialValue);

  return {
    subscribe,
    
    add(exercise) {
      update(bookmarks => {
        if (!bookmarks.some(b => b.id === exercise.id)) {
          const newBookmarks = [...bookmarks, exercise];
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
          }
          return newBookmarks;
        }
        return bookmarks;
      });
    },

    remove(exercise) {
      update(bookmarks => {
        const newBookmarks = bookmarks.filter(b => b.id !== exercise.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
        }
        return newBookmarks;
      });
    },

    toggle(exercise) {
      update(bookmarks => {
        const isBookmarked = bookmarks.some(b => b.id === exercise.id);
        const newBookmarks = isBookmarked
          ? bookmarks.filter(b => b.id !== exercise.id)
          : [...bookmarks, exercise];
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
        }
        return newBookmarks;
      });
    },

    clear() {
      set([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };
}

export const bookmarks = createBookmarkStore();

export const bookmarkCount = derived(bookmarks, $bookmarks => $bookmarks.length);

export const isBookmarked = derived(bookmarks, $bookmarks => 
  (exercise) => $bookmarks.some(b => b.id === exercise.id)
);
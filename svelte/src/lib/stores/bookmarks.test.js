import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { bookmarks, bookmarkCount, isBookmarked } from './bookmarks.js';

describe('Bookmark Store', () => {
  const mockExercise1 = { id: '1', name: 'Push Up' };
  const mockExercise2 = { id: '2', name: 'Pull Up' };

  beforeEach(() => {
    bookmarks.clear();
    localStorage.clear();
  });

  describe('bookmarks', () => {
    it('should start empty', () => {
      expect(get(bookmarks)).toEqual([]);
    });

    it('should add exercise to bookmarks', () => {
      bookmarks.add(mockExercise1);
      
      const bookmarkList = get(bookmarks);
      expect(bookmarkList).toHaveLength(1);
      expect(bookmarkList[0]).toEqual(mockExercise1);
    });

    it('should not add duplicate exercises', () => {
      bookmarks.add(mockExercise1);
      bookmarks.add(mockExercise1);
      
      expect(get(bookmarks)).toHaveLength(1);
    });

    it('should remove exercise from bookmarks', () => {
      bookmarks.add(mockExercise1);
      bookmarks.add(mockExercise2);
      bookmarks.remove(mockExercise1);
      
      const bookmarkList = get(bookmarks);
      expect(bookmarkList).toHaveLength(1);
      expect(bookmarkList[0]).toEqual(mockExercise2);
    });

    it('should toggle exercise bookmark status', () => {
      // Add
      bookmarks.toggle(mockExercise1);
      expect(get(bookmarks)).toHaveLength(1);
      
      // Remove
      bookmarks.toggle(mockExercise1);
      expect(get(bookmarks)).toHaveLength(0);
    });

    it('should save to localStorage', () => {
      bookmarks.add(mockExercise1);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'savedExercises',
        JSON.stringify([mockExercise1])
      );
    });
  });

  describe('bookmarkCount', () => {
    it('should return correct count', () => {
      expect(get(bookmarkCount)).toBe(0);
      
      bookmarks.add(mockExercise1);
      expect(get(bookmarkCount)).toBe(1);
      
      bookmarks.add(mockExercise2);
      expect(get(bookmarkCount)).toBe(2);
    });
  });

  describe('isBookmarked', () => {
    it('should return correct bookmark status', () => {
      // Get the function from the derived store
      let checkBookmarked = get(isBookmarked);
      
      expect(checkBookmarked(mockExercise1)).toBe(false);
      
      bookmarks.add(mockExercise1);
      
      // Re-get the function after the store has updated
      checkBookmarked = get(isBookmarked);
      expect(checkBookmarked(mockExercise1)).toBe(true);
      expect(checkBookmarked(mockExercise2)).toBe(false);
    });
  });
});
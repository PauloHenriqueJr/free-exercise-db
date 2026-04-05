import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { 
  exercises, 
  query, 
  searchResults, 
  paginatedResults, 
  loading, 
  error,
  exerciseActions 
} from './exercises.js';

describe('Exercise Store', () => {
  beforeEach(() => {
    // Reset stores
    exercises.set([]);
    query.set('');
    loading.set(false);
    error.set(null);
  });

  describe('searchResults', () => {
    it('should return all exercises when query is empty', () => {
      const mockExercises = [
        { id: '1', name: 'Push Up', instructions: ['Basic push up'] },
        { id: '2', name: 'Pull Up', instructions: ['Basic pull up'] }
      ];
      
      exercises.set(mockExercises);
      query.set('');
      
      expect(get(searchResults)).toEqual(mockExercises);
    });

    it('should filter exercises by name', () => {
      const mockExercises = [
        { id: '1', name: 'Push Up', instructions: ['Basic push up'] },
        { id: '2', name: 'Pull Up', instructions: ['Basic pull up'] },
        { id: '3', name: 'Bench Press', instructions: ['Press the barbell'] }
      ];
      
      exercises.set(mockExercises);
      query.set('push');
      
      const results = get(searchResults);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Push Up');
    });

    it('should return empty array for short queries', () => {
      const mockExercises = [
        { id: '1', name: 'Push Up', instructions: ['Basic push up'] }
      ];
      
      exercises.set(mockExercises);
      query.set('p'); // Single character
      
      expect(get(searchResults)).toEqual(mockExercises);
    });
  });

  describe('paginatedResults', () => {
    it('should return correct number of items for first page', () => {
      const mockExercises = Array.from({ length: 75 }, (_, i) => ({
        id: String(i + 1),
        name: `Exercise ${i + 1}`,
        instructions: []
      }));
      
      exercises.set(mockExercises);
      
      const results = get(paginatedResults);
      expect(results).toHaveLength(50); // PAGE_SIZE
    });
  });

  describe('exerciseActions', () => {
    it('should fetch exercises successfully', async () => {
      const mockData = [
        { id: '1', name: 'Test Exercise', instructions: [] }
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      await exerciseActions.fetchExercises();

      expect(get(exercises)).toEqual(mockData);
      expect(get(loading)).toBe(false);
      expect(get(error)).toBe(null);
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await exerciseActions.fetchExercises();

      expect(get(exercises)).toEqual([]);
      expect(get(loading)).toBe(false);
      expect(get(error)).toBe('Network error');
    });

    it('should set query and reset page', () => {
      exerciseActions.setQuery('test query');
      
      expect(get(query)).toBe('test query');
    });
  });
});
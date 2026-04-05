import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ExerciseCard from './ExerciseCard.svelte';

// Mock all Flowbite components for testing
vi.mock('flowbite-svelte', () => ({
  Card: ({ children, ...props }) => `<div data-testid="card" ${Object.entries(props).map(([k,v]) => `${k}="${v}"`).join(' ')}>${children || ''}</div>`,
  Button: ({ children, onclick, ...props }) => `<button ${Object.entries(props).map(([k,v]) => `${k}="${v}"`).join(' ')} onclick="${onclick}">${children || ''}</button>`,
  Badge: ({ children, ...props }) => `<span data-testid="badge" ${Object.entries(props).map(([k,v]) => `${k}="${v}"`).join(' ')}>${children || ''}</span>`
}));

vi.mock('flowbite-svelte-icons', () => ({
  BookmarkOutline: () => '<svg data-testid="bookmark-outline"></svg>',
  BookmarkSolid: () => '<svg data-testid="bookmark-solid"></svg>'
}));

// Mock the component dependencies
vi.mock('./PhotoGallery.svelte', () => ({
  default: ({ photos }) => `<div data-testid="photo-gallery">Photos: ${photos?.length || 0}</div>`
}));

vi.mock('./ExerciseInstructions.svelte', () => ({
  default: ({ text }) => `<div data-testid="exercise-instructions">Instructions: ${text?.length || 0}</div>`
}));

describe('ExerciseCard', () => {
  const mockExercise = {
    id: '1',
    name: 'Push Up',
    primaryMuscles: ['chest', 'triceps'],
    equipment: 'bodyweight',
    level: 'beginner',
    instructions: ['Place hands on ground', 'Lower body', 'Push back up'],
    images: ['pushup1.jpg', 'pushup2.jpg']
  };

  it('should render exercise name', () => {
    render(ExerciseCard, {
      exercise: mockExercise,
      isBookmarked: false
    });

    expect(screen.getByText('Push Up')).toBeInTheDocument();
  });

  it('should render primary muscles as badges', () => {
    render(ExerciseCard, {
      exercise: mockExercise,
      isBookmarked: false
    });

    expect(screen.getByText('chest')).toBeInTheDocument();
    expect(screen.getByText('triceps')).toBeInTheDocument();
  });

  it('should render equipment badge', () => {
    render(ExerciseCard, {
      exercise: mockExercise,
      isBookmarked: false
    });

    expect(screen.getByText('bodyweight')).toBeInTheDocument();
  });

  it('should render level badge', () => {
    render(ExerciseCard, {
      exercise: mockExercise,
      isBookmarked: false
    });

    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('should call onBookmarkToggle when bookmark button clicked', async () => {
    const onBookmarkToggle = vi.fn();
    
    render(ExerciseCard, {
      exercise: mockExercise,
      isBookmarked: false,
      onBookmarkToggle
    });

    const bookmarkButton = screen.getByLabelText('Add to bookmarks');
    await fireEvent.click(bookmarkButton);

    expect(onBookmarkToggle).toHaveBeenCalledOnce();
  });

  it('should show correct bookmark icon based on isBookmarked prop', () => {
    const { rerender } = render(ExerciseCard, {
      exercise: mockExercise,
      isBookmarked: false
    });

    expect(screen.getByLabelText('Add to bookmarks')).toBeInTheDocument();

    rerender({
      exercise: mockExercise,
      isBookmarked: true
    });

    expect(screen.getByLabelText('Remove from bookmarks')).toBeInTheDocument();
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalExercise = {
      id: '2',
      name: 'Minimal Exercise'
    };

    render(ExerciseCard, {
      exercise: minimalExercise,
      isBookmarked: false
    });

    expect(screen.getByText('Minimal Exercise')).toBeInTheDocument();
    // Should not crash with missing fields
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ExerciseInstructions from './ExerciseInstructions.svelte';

// Mock Flowbite components for testing
vi.mock('flowbite-svelte', () => ({
  Button: 'button'
}));

vi.mock('flowbite-svelte-icons', () => ({
  ChevronRightOutline: 'svg'
}));

describe('ExerciseInstructions', () => {
  it('should render first instruction', () => {
    const instructions = [
      'First instruction',
      'Second instruction',
      'Third instruction'
    ];

    render(ExerciseInstructions, { text: instructions });

    expect(screen.getByText('First instruction')).toBeInTheDocument();
  });

  it('should show expand button when multiple instructions', () => {
    const instructions = [
      'First instruction',
      'Second instruction'
    ];

    render(ExerciseInstructions, { text: instructions });

    expect(screen.getByText('Show more instructions')).toBeInTheDocument();
  });

  it('should not show expand button for single instruction', () => {
    const instructions = ['Only instruction'];

    render(ExerciseInstructions, { text: instructions });

    expect(screen.queryByText('Show more instructions')).not.toBeInTheDocument();
  });

  it('should expand to show all instructions when clicked', async () => {
    const instructions = [
      'First instruction',
      'Second instruction',
      'Third instruction'
    ];

    render(ExerciseInstructions, { text: instructions });

    // Initially only first instruction should be visible
    expect(screen.getByText('First instruction')).toBeInTheDocument();
    expect(screen.queryByText('Second instruction')).not.toBeInTheDocument();
    expect(screen.queryByText('Third instruction')).not.toBeInTheDocument();

    const expandButton = screen.getByText('Show more instructions');
    await fireEvent.click(expandButton);

    // After clicking, all instructions should be visible
    expect(screen.getByText('First instruction')).toBeInTheDocument();
    expect(screen.getByText('Second instruction')).toBeInTheDocument();
    expect(screen.getByText('Third instruction')).toBeInTheDocument();
    expect(screen.queryByText('Show more instructions')).not.toBeInTheDocument();
  });

  it('should handle empty instructions array', () => {
    const { container } = render(ExerciseInstructions, { text: [] });

    // Should not crash and should not show any instructions
    expect(container.textContent).toBe('');
    expect(screen.queryByText('Show more instructions')).not.toBeInTheDocument();
  });

  it('should handle undefined instructions', () => {
    const { container } = render(ExerciseInstructions, { text: undefined });

    // Should not crash
    expect(container.textContent).toBe('');
    expect(screen.queryByText('Show more instructions')).not.toBeInTheDocument();
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import PhotoGallery from './PhotoGallery.svelte';

// Mock Flowbite components for testing
vi.mock('flowbite-svelte', () => ({
  Button: 'button'
}));

vi.mock('flowbite-svelte-icons', () => ({
  ArrowsRepeatOutline: 'svg'
}));

describe('PhotoGallery', () => {
  const mockPhotos = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];

  it('should render first photo by default', () => {
    render(PhotoGallery, { photos: mockPhotos });

    const image = screen.getByAltText('Exercise demonstration');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('photo1.jpg');
  });

  it('should show photo counter for multiple photos', () => {
    render(PhotoGallery, { photos: mockPhotos });

    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('should not show counter for single photo', () => {
    render(PhotoGallery, { photos: ['single.jpg'] });

    expect(screen.queryByText('1/1')).not.toBeInTheDocument();
  });

  it('should cycle to next photo when clicked', async () => {
    render(PhotoGallery, { photos: mockPhotos });

    const button = screen.getByRole('button');
    
    // Mock the image load event
    const image = screen.getByAltText('Exercise demonstration');
    
    await fireEvent.click(button);
    
    // Simulate image load to clear loading state
    await fireEvent.load(image);

    expect(image.src).toContain('photo2.jpg');
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('should cycle back to first photo from last', async () => {
    render(PhotoGallery, { photos: mockPhotos });

    const button = screen.getByRole('button');
    const image = screen.getByAltText('Exercise demonstration');
    
    // Click through all photos
    await fireEvent.click(button); // photo2
    await fireEvent.load(image);
    await fireEvent.click(button); // photo3
    await fireEvent.load(image);
    await fireEvent.click(button); // back to photo1
    await fireEvent.load(image);

    expect(image.src).toContain('photo1.jpg');
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('should handle empty photos array', () => {
    render(PhotoGallery, { photos: [] });

    // Should not crash but might not show an image
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(PhotoGallery, { photos: mockPhotos });

    const image = screen.getByAltText('Exercise demonstration');
    expect(image).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
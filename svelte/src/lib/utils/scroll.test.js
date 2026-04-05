import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createInfiniteScroll, scrollToTop, scrollToElement } from './scroll.js';

describe('Scroll Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
    // Mock window properties
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, value: 2000 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createInfiniteScroll', () => {
    it('should call callback when scrolled to bottom', () => {
      const callback = vi.fn();
      const scroll = createInfiniteScroll(callback);
      
      // Mock being near bottom
      window.scrollY = 1200;
      window.innerHeight = 800;
      document.documentElement.scrollHeight = 2000;
      
      scroll.attach();
      
      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'));
      
      // Fast-forward timers
      vi.advanceTimersByTime(400);
      
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should not call callback when not at bottom', () => {
      const callback = vi.fn();
      const scroll = createInfiniteScroll(callback);
      
      // Mock being at top
      window.scrollY = 0;
      
      scroll.attach();
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(400);
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('should respect custom threshold', () => {
      const callback = vi.fn();
      const threshold = 200;
      const scroll = createInfiniteScroll(callback, threshold);
      
      // Mock being within custom threshold
      window.scrollY = 1000;
      window.innerHeight = 800;
      document.documentElement.scrollHeight = 2000;
      
      scroll.attach();
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(400);
      
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should cleanup event listeners', () => {
      const callback = vi.fn();
      const scroll = createInfiniteScroll(callback);
      
      scroll.attach();
      scroll.detach();
      
      window.scrollY = 1200;
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(400);
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    it('should call window.scrollTo with correct params', () => {
      scrollToTop();
      
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  describe('scrollToElement', () => {
    it('should scroll to element when found', () => {
      const mockElement = {
        scrollIntoView: vi.fn()
      };
      
      global.document.querySelector = vi.fn().mockReturnValue(mockElement);
      
      scrollToElement('.test-element');
      
      expect(document.querySelector).toHaveBeenCalledWith('.test-element');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should not throw when element not found', () => {
      global.document.querySelector = vi.fn().mockReturnValue(null);
      
      expect(() => scrollToElement('.nonexistent')).not.toThrow();
    });
  });
});
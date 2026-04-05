/**
 * Creates an infinite scroll handler with debouncing
 * @param {Function} callback - Function to call when bottom is reached
 * @param {number} threshold - Distance from bottom to trigger (default: 100px)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 400ms)
 * @returns {Object} Object with attach and detach methods
 */
export function createInfiniteScroll(callback, threshold = 100, debounceMs = 400) {
  let timeoutId = null;
  let isProcessing = false;

  function handleScroll() {
    if (isProcessing) return;

    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;
    
    if (scrollY + innerHeight >= scrollHeight - threshold) {
      isProcessing = true;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        callback();
        isProcessing = false;
      }, debounceMs);
    }
  }

  return {
    attach() {
      window.addEventListener('scroll', handleScroll, { passive: true });
    },
    
    detach() {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
}

/**
 * Smooth scroll to top of page
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector for target element
 */
export function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
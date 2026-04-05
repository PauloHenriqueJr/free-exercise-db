import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock fetch globally for tests
global.fetch = vi.fn();

// Mock localStorage with proper implementation
const localStorageMock = {
  getItem: vi.fn((key) => {
    return localStorageMock.store[key] || null;
  }),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value.toString();
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
  store: {}
};
global.localStorage = localStorageMock;

// Mock window.scrollTo
global.scrollTo = vi.fn();

// Mock window properties for scroll tests
Object.defineProperty(window, 'scrollY', { 
  writable: true, 
  value: 0 
});
Object.defineProperty(window, 'innerHeight', { 
  writable: true, 
  value: 800 
});
Object.defineProperty(document.documentElement, 'scrollHeight', { 
  writable: true, 
  value: 2000 
});

// Mock addEventListener and removeEventListener
const eventListeners = new Map();
global.addEventListener = vi.fn((event, handler) => {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event).add(handler);
});

global.removeEventListener = vi.fn((event, handler) => {
  if (eventListeners.has(event)) {
    eventListeners.get(event).delete(handler);
  }
});

window.addEventListener = global.addEventListener;
window.removeEventListener = global.removeEventListener;

// Mock dispatchEvent
window.dispatchEvent = vi.fn((event) => {
  if (eventListeners.has(event.type)) {
    eventListeners.get(event.type).forEach(handler => handler(event));
  }
});

// Reset all mocks and state before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.store = {};
  eventListeners.clear();
  window.scrollY = 0;
  window.innerHeight = 800;
  document.documentElement.scrollHeight = 2000;
});
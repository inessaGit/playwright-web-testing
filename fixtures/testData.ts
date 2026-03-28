/**
 * Viewport dimensions used in responsive tests.
 */
export const viewports = [
  { width: 1920, height: 1080, label: 'Full HD Desktop' },
  { width: 1280, height: 800,  label: 'Standard Laptop' },
  { width: 768,  height: 1024, label: 'Tablet (iPad)' },
  { width: 390,  height: 844,  label: 'Mobile (iPhone 14)' },
] as const;

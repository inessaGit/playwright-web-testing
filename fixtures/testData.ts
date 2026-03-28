import { DemoFormData } from '../pages/ContactPage';

/**
 * Valid form data for happy-path demo request form tests.
 */
export const validFormData: DemoFormData = {
  name: 'Jane Smith',
  email: 'jane.smith@testcompany.io',
  company: 'Test Company Inc.',
  message:
    'We are interested in deploying ManageXR across 50 devices in our enterprise environment. Please send more information.',
};

/**
 * Form data with an invalid email address to trigger email validation errors.
 */
export const invalidFormData: DemoFormData = {
  name: 'John Doe',
  email: 'not-a-valid-email',
  company: 'Some Corp',
  message: 'Testing invalid email handling.',
};

/**
 * Form data with an empty email to trigger required-field errors.
 */
export const emptyEmailFormData: DemoFormData = {
  name: 'Empty Email Test',
  email: '',
  company: 'Test Org',
  message: 'This submission should fail due to missing email.',
};

/**
 * Completely empty form data for testing all-fields-required validation.
 */
export const emptyFormData: DemoFormData = {
  name: '',
  email: '',
  company: '',
  message: '',
};

/**
 * Viewport dimensions used in responsive tests.
 */
export const viewports = [
  { width: 1920, height: 1080, label: 'Full HD Desktop' },
  { width: 1280, height: 800, label: 'Standard Laptop' },
  { width: 768, height: 1024, label: 'Tablet (iPad)' },
  { width: 390, height: 844, label: 'Mobile (iPhone 14)' },
] as const;

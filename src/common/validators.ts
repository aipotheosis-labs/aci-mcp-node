/**
 * Validators for common functionality
 */

export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey) {
    throw new Error('ACI_API_KEY is required. Please set the appropriate environment variable.');
  }

  const invalidKeys = ['<YOUR_ACI_API_KEY>', 'ACI_API_KEY', '<ACI_API_KEY>'];
  if (invalidKeys.includes(apiKey)) {
    throw new Error('ACI_API_KEY is invalid. Please set the appropriate environment variable.');
  }
}

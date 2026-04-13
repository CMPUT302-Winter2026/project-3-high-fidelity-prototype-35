// Helper function to normalize Cree special characters for search
export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[âā]/g, 'a')
    .replace(/[êē]/g, 'e')
    .replace(/[îī]/g, 'i')
    .replace(/[ôō]/g, 'o');
}


const BASE_URL = 'https://twgwprojects.github.io/wp_legal_pages/api';

export async function getLegalPage(slug) {
  const response = await fetch(`${BASE_URL}/${slug}.json`);
  if (!response.ok) {
    throw new Error('Legal page not found');
  }
  re


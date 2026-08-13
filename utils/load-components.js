export async function loadComponent(path) {
  const response = await fetch(path);
  return response.text();
}
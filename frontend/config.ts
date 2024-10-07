const apiUrl = import.meta.env.VITE_BACKEND_API_URL

if (!apiUrl) {
  throw new Error('VITE_BACKEND_API_URL não está definida');
}

export { apiUrl };

import { apiRouter } from './api-router.js';
import { sendError } from '../utils/http.js';

export async function router(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    return apiRouter(request, response, url);
  }

  return sendError(response, 404, 'Route not found');
}

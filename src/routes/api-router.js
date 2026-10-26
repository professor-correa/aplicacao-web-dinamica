import { apiRoutes } from './api-routes.js';
import { findRoute } from '../utils/match-path.js';
import { sendError } from '../utils/http.js';
import { handleError } from '../utils/handle-error.js';

export async function apiRouter(request, response, url) {
  try {
    const { route, params, allowedMethods } = findRoute(apiRoutes, request.method, url.pathname);

    if (!route && allowedMethods.length > 0) {
      response.setHeader('Allow', allowedMethods.join(', '));
      return sendError(response, 405, 'Method not allowed');
    }

    if (!route) {
      return sendError(response, 404, 'Route not found');
    }

    return await route.handler({ request, response, params, query: url.searchParams });
  } catch (error) {
    return handleError(response, error);
  }
}

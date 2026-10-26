import { pageRoutes } from './page-routes.js';
import { findRoute } from '../utils/match-path.js';
import { sendHtml } from '../utils/http.js';
import { notFoundPage, serverErrorPage } from '../views/errors/error-page.js';

export async function pageRouter(request, response, url) {
  const context = {
    user: null,
    currentPath: url.pathname,
    notice: url.searchParams.get('notice'),
  };

  try {
    const { route, params, allowedMethods } = findRoute(pageRoutes, request.method, url.pathname);

    if (!route) {
      if (allowedMethods.length > 0) {
        response.setHeader('Allow', allowedMethods.join(', '));
      }

      return sendHtml(response, allowedMethods.length > 0 ? 405 : 404, notFoundPage(context));
    }

    return await route.handler({ request, response, params, query: url.searchParams, context });
  } catch (error) {
    // O detalhe técnico fica só no terminal. Para quem usa o site, uma página genérica.
    console.error(error);

    if (response.headersSent) {
      return response.end();
    }

    return sendHtml(response, 500, serverErrorPage(context));
  }
}

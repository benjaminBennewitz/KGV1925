/* src/app/app.routes.server.ts */

import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_BEITRAEGE } from './shared/data/blog-beitraege.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'aktuelles/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams(): Promise<Record<string, string>[]> {
      return BLOG_BEITRAEGE.map((beitrag) => ({
        slug: beitrag.slug,
      }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
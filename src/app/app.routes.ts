/* src/app/app.routes.ts */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Startseite | KGV1925',
    loadComponent: () => import('./pages/startseite/startseite.component').then((modul) => modul.StartseiteComponent),
  },
  {
    path: 'verein',
    title: 'Unser Verein | KGV1925',
    loadComponent: () => import('./pages/verein/verein.component').then((modul) => modul.VereinComponent),
  },
  {
    path: 'aktuelles',
    title: 'Aktuelles | KGV1925',
    loadComponent: () => import('./pages/aktuelles/aktuelles.component').then((modul) => modul.AktuellesComponent),
  },
  {
    path: 'aktuelles/:slug',
    title: 'Beitrag | KGV1925',
    loadComponent: () => import('./pages/blog-beitrag/blog-beitrag.component').then((modul) => modul.BlogBeitragComponent),
  },
  {
    path: 'termine',
    title: 'Termine | KGV1925',
    loadComponent: () => import('./pages/termine/termine.component').then((modul) => modul.TermineComponent),
  },
  {
    path: 'gartenwissen',
    title: 'Gartenwissen | KGV1925',
    loadComponent: () => import('./pages/gartenwissen/gartenwissen.component').then((modul) => modul.GartenwissenComponent),
  },
  {
    path: 'service',
    title: 'Service | KGV1925',
    loadComponent: () => import('./pages/service/service.component').then((modul) => modul.ServiceComponent),
  },
  {
    path: 'kontakt',
    title: 'Kontakt | KGV1925',
    loadComponent: () => import('./pages/kontakt/kontakt.component').then((modul) => modul.KontaktComponent),
  },
  {
    path: 'mitgliederbereich',
    title: 'Mitgliederbereich | KGV1925',
    loadComponent: () => import('./pages/mitgliederbereich/mitgliederbereich.component').then((modul) => modul.MitgliederbereichComponent),
  },
  {
    path: '**',
    title: 'Seite nicht gefunden | KGV1925',
    loadComponent: () => import('./pages/nicht-gefunden/nicht-gefunden.component').then((modul) => modul.NichtGefundenComponent),
  },
];

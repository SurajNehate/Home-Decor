import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'catalog', loadComponent: () => import('./catalog/product-list.component').then(m => m.ProductListComponent) },
  { path: 'catalog/:id', loadComponent: () => import('./catalog/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout-guest', loadComponent: () => import('./checkout/checkout-guest.component').then(m => m.CheckoutGuestComponent) },
  { path: 'contact-us', loadComponent: () => import('./contact/contact-us.component').then(m => m.ContactUsComponent) },
  { path: 'admin-login', loadComponent: () => import('./admin/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin/catalog', loadComponent: () => import('./admin/catalog-admin.component').then(m => m.CatalogAdminComponent) },
  { path: '**', redirectTo: '' }
];

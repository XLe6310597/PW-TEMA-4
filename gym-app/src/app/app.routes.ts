import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Memberships } from './pages/memberships/memberships';
import { Routines } from './pages/routines/routines';
import { Contact } from './pages/contact/contact'; // 👈 Importación del nuevo apartado del Coach
import { Login } from './auth/login/login';
import { Register } from './auth/register/register'; 
import { Admin } from './dashboard/admin/admin';
import { User } from './dashboard/user/user';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'membresias', component: Memberships },
  { path: 'rutinas', component: Routines },
  { path: 'contacto', component: Contact }, // 👈 Ruta pública oficial asignada para el Coach
  { path: 'login', component: Login },
  { path: 'register', component: Register }, 
  { 
    path: 'dashboard', 
    children: [
      { path: 'admin', component: Admin },
      { path: 'user', component: User }
    ]
  },
  { path: '**', redirectTo: '' }
];
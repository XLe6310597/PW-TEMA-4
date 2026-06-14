import { Component } from '@angular/core';
// Importa RouterLinkActive aquí
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que diga true
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive // Agrega esta línea para habilitar el [routerLinkActiveOptions]
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  // Información centralizada del Coach
  public coachInfo = {
    nombre: 'Coach Principal GymPro',
    horarioAtencion: 'Lunes a Viernes: 6:00 AM - 10:00 PM | Sábados: 7:00 AM - 2:00 PM',
    telefono: '+52 963 123 4567',
    correo: 'coach@gympro.com',
    ubicacion: 'Frontera Comalapa, Chiapas, México'
  };
}
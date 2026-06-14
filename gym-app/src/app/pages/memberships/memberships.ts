import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Plan {
  nombre: string;
  precio: number;
  descripcion: string;
  beneficios: string[];
  recomendado: boolean;
  color: string;
}

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memberships.html',
  styleUrl: './memberships.css',
})
export class Memberships {
  
  // QUITAMOS LA PALABRA 'public' PARA EVITAR EL ERROR DE COMPILACIÓN EN EL TEMPLATE
  planes: Plan[] = [
    {
      nombre: 'Básico',
      precio: 199,
      descripcion: 'Ideal para empezar tu cambio.',
      beneficios: [
        'Acceso área de pesas', 
        'Vestidores y regaderas', 
        'App de entrenamiento'
      ],
      recomendado: false,
      color: '#666'
    },
    {
      nombre: 'Pro',
      precio: 399,
      descripcion: 'El balance perfecto para resultados.',
      beneficios: [
        'Todo lo del Básico', 
        'Clases grupales', 
        'Evaluación física mensual', 
        'Acceso a todas las sucursales'
      ],
      recomendado: true,
      color: 'var(--primary)'
    },
    {
      nombre: 'Elite',
      precio: 599,
      descripcion: 'Experiencia premium completa.',
      beneficios: [
        'Todo lo del Pro', 
        'Entrenador personal 2 días/semana', 
        'Sillones de masaje VIP', 
        'Nutrición personalizada'
      ],
      recomendado: false,
      color: '#1a1a1a'
    }
  ];

  constructor(private router: Router) {}

  seleccionarPlan(planNombre: string): void {
    console.log(`Plan seleccionado para redirección: ${planNombre}`);
    this.router.navigate(['/register'], { 
      queryParams: { plan: planNombre } 
    });
  }
}
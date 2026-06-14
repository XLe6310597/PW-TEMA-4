import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './routines.html',
  styleUrl: './routines.css',
})
export class Routines {
  nivelSeleccionado: string = '';
  datosNivelActivo: any = null;

  public niveles = [
    { 
      nivel: 'Principiante', 
      objetivo: 'Acondicionamiento físico y técnica base.', 
      duracion: '45-60 min', 
      frecuencia: '3 días/semana', 
      color: '#22c55e',
      descripcionDetallada: 'Este programa está diseñado para construir una base sólida y adaptar tus ligamentos y músculos sin riesgo de lesión. Nos enfocamos en aprender la ejecución perfecta de los ejercicios compuestos básicos.',
      enfoqueDias: [
        { dia: 'Lunes', enfoque: 'Fullbody (Empuje dominante) - Pecho, Hombro y Cuádriceps' },
        { dia: 'Miércoles', enfoque: 'Fullbody (Tracción dominante) - Espalda, Bíceps y Femoral' },
        { dia: 'Viernes', enfoque: 'Fullbody (Énfasis metabólico) - Circuito de Core, Brazos y Piernas' }
      ]
    },
    { 
      nivel: 'Intermedio', 
      objetivo: 'Hipertrofia y aumento de fuerza resistencia.', 
      duracion: '60-80 min', 
      frecuencia: '4-5 días/semana', 
      color: '#f0c32e',
      descripcionDetallada: 'Para atletas que ya dominan la técnica y buscan ganancias notables en masa muscular y fuerza. Incrementamos el volumen de series semanales por grupo muscular utilizando divisiones eficientes.',
      enfoqueDias: [
        { dia: 'Lunes', enfoque: 'Torso - Pecho pesado, Espalda y Hombros' },
        { dia: 'Martes', enfoque: 'Pierna - Cuádriceps, Pantorrilla y Abdomen' },
        { dia: 'Jueves', enfoque: 'Torso - Enfoque en Brazos, Densidad de Espalda y Deltoides' },
        { dia: 'Viernes', enfoque: 'Pierna - Énfasis en Cadena Posterior (Femoral y Glúteo)' }
      ]
    },
    { 
      nivel: 'Avanzado', 
      objetivo: 'Máximo rendimiento y potencia muscular.', 
      duracion: '90+ min', 
      frecuencia: '5-6 días/semana', 
      color: '#ef4444',
      descripcionDetallada: 'Diseñado bajo esquemas de alta intensidad, técnicas de intensificación (Rest-Pause, Dropsets) y cargas progresivas pesadas. Ideal para romper estancamientos y llevar el físico al límite.',
      enfoqueDias: [
        { dia: 'Lunes', enfoque: 'Empuje (Push) - Pecho pesado, Hombro y Tríceps' },
        { dia: 'Martes', enfoque: 'Tracción (Pull) - Espalda, Trapecio y Bíceps' },
        { dia: 'Miércoles', enfoque: 'Pierna Completa (Quad dominant) + Pantorrilla' },
        { dia: 'Viernes', enfoque: 'Torso / Brazos - Enfoque estético e hipertrofia sarcoplásmica' },
        { dia: 'Sábado', enfoque: 'Cadena Posterior (Posterior Chain) + Core' }
      ]
    }
  ];

  constructor(private router: Router) {}

  verDetalles(nivel: string) {
    this.nivelSeleccionado = nivel;
    // Asigna los datos estáticos de la metodología inmediatamente
    this.datosNivelActivo = this.niveles.find(n => n.nivel === nivel);
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}
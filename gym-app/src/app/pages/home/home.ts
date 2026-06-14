import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  
  public heroContent = {
    titulo: 'ERES FUERZA',
    resaltado: 'TODOS LOS DÍAS',
    subtitulo: '1er mes + anualidad GRATIS. Únete a la comunidad líder en Chiapas.',
    textoBoton: '¡INSCRÍBETE YA!'
  };

  public beneficios = [
    { 
      icono: '💪', 
      titulo: 'Rutinas personalizadas', 
      descripcion: 'Entrena según tu nivel con planes diseñados por expertos en sistemas de entrenamiento.',
      colorAcento: '#f0c32e' 
    },
    { 
      icono: '📈', 
      titulo: 'Seguimiento real', 
      descripcion: 'Mide tu progreso semanal con métricas avanzadas y objetivos claros.',
      colorAcento: '#007bff'
    },
    { 
      icono: '🔥', 
      titulo: 'Resultados', 
      descripcion: 'Cambia tu cuerpo y tu mente con una metodología de disciplina guiada.',
      colorAcento: '#ff4d4d'
    }
  ];

  // Sincronizado con tus planes reales
  public planesMuestra = [
    {
      nombre: 'Básico',
      precio: 199,
      popular: false,
      beneficios: ['Acceso área de pesas', 'Vestidores y regaderas', 'App de entrenamiento']
    },
    {
      nombre: 'Pro',
      precio: 399,
      popular: true,
      beneficios: ['Todo lo del Básico', 'Clases grupales', 'Evaluación física mensual']
    },
    {
      nombre: 'Elite',
      precio: 599,
      popular: false,
      beneficios: ['Todo lo del Pro', 'Entrenador personal', 'Sillones de masaje VIP']
    }
  ];

  ngOnInit(): void {
    console.log('GYM PRO - Home actualizado');
  }
}
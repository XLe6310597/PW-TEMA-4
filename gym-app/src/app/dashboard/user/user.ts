import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit {
  seccionActiva: string = 'resumen'; 

  // Datos del Atleta
  atletaName: string = 'Atleta';
  atletaNivel: string = 'Principiante';
  rutinas: any[] = [];
  
  // NUEVAS VARIABLES PARA LA MEMBRESÍA
  fechaInicio: string = '-- --- ----';
  fechaFin: string = '-- --- ----';

  loading: boolean = true;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const name = localStorage.getItem('user_name');
    const nivel = localStorage.getItem('user_nivel');

    if (name) this.atletaName = name;
    if (nivel) this.atletaNivel = nivel;

    // Procesar Fechas de Membresía guardadas al iniciar sesión
    this.configurarFechasMembresia();

    this.cargarMisRutinas();
  }

  /**
   * Obtiene y formatea el ciclo de pago del usuario en formato legible en español
   */
  configurarFechasMembresia() {
    // Intentamos recuperar la fecha de registro guardada en la base de datos
    const registroRaw = localStorage.getItem('user_fecha_registro');
    
    let dateInicio = registroRaw ? new Date(registroRaw) : new Date();
    
    // Si la fecha es inválida por formato, usamos la fecha de hoy por seguridad
    if (isNaN(dateInicio.getTime())) {
      dateInicio = new Date();
    }

    // Calcular fecha de vencimiento sumando 30 días naturales
    let dateFin = new Date(dateInicio);
    dateFin.setDate(dateFin.getDate() + 30);

    // Opciones para formatear la fecha a un estilo limpio: "13 de jun de 2026"
    const opcionesFormato: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };

    this.fechaInicio = dateInicio.toLocaleDateString('es-MX', opcionesFormato);
    this.fechaFin = dateFin.toLocaleDateString('es-MX', opcionesFormato);
  }

  async cargarMisRutinas() {
    this.loading = true;
    this.error = '';
    try {
      this.rutinas = await this.authService.obtenerRutinasPorNivel(this.atletaNivel);
    } catch (err: any) {
      this.error = 'Ocurrió un problema al descargar tu plan de entrenamiento semanal.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
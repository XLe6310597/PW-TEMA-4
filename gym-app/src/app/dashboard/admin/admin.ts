import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  // Pestaña activa por defecto
  seccionActiva: string = 'subir';

  // Campos para el formulario de rutinas
  nombre_rutina: string = '';
  nivel: string = 'Principiante';
  dia_semana: string = 'Lunes';
  duracion: string = '';
  frecuencia: string = '';
  archivo_url_resultado: string = '';

  // Arreglo para almacenar los atletas que vienen de Supabase
  listaAtletas: any[] = [];

  // Estados de control para la UI
  mensajeExito: string = '';
  error: string = '';
  subiendoArchivo: boolean = false;
  loadingAtletas: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Descargamos la lista de atletas desde que arranca el componente
    this.cargarAtletasRegistrados();
  }

  /**
   * Descarga todos los perfiles guardados en Supabase
   */
  async cargarAtletasRegistrados() {
    this.loadingAtletas = true;
    try {
      this.listaAtletas = await this.authService.obtenerTodosLosPerfiles();
    } catch (err: any) {
      console.error('Error al cargar atletas:', err);
    } finally {
      this.loadingAtletas = false;
    }
  }

  /**
   * Captura el archivo binario seleccionado desde la PC
   */
  async onArchivoSeleccionado(event: any) {
    const archivoSeleccionado: File = event.target.files[0];
    if (!archivoSeleccionado) return;

    this.error = '';
    this.subiendoArchivo = true;

    try {
      const urlPublica = await this.authService.subirPDFRutina(archivoSeleccionado);
      this.archivo_url_resultado = urlPublica;
      console.log('Archivo subido con éxito:', urlPublica);
    } catch (err: any) {
      console.error(err);
      this.error = 'No se pudo subir el archivo. Verifica tu conexión.';
    } finally {
      this.subiendoArchivo = false;
    }
  }

  /**
   * Inserta los datos combinados en la tabla 'rutinas'
   */
  async onSubirRutina() {
    this.error = '';
    this.mensajeExito = '';

    if (!this.nombre_rutina) {
      this.error = 'Por favor, introduce el enfoque o nombre de la rutina.';
      return;
    }

    if (!this.archivo_url_resultado) {
      this.error = 'Por favor, selecciona un archivo válido de tu computadora.';
      return;
    }

    try {
      // Concatenamos el día de la semana al nombre de la rutina para que el atleta lo vea organizado
      const tituloConDia = `[${this.dia_semana}] - ${this.nombre_rutina}`;

      const nuevaRutina = {
        nombre_rutina: tituloConDia,
        nivel: this.nivel,
        archivo_url: this.archivo_url_resultado,
        duracion: this.duracion || '60 min',
        frecuencia: this.frecuencia || '4 Series'
      };

      await this.authService.crearNuevaRutina(nuevaRutina);
      
      this.mensajeExito = `¡Rutina del día ${this.dia_semana} publicada con éxito!`;
      this.limpiarFormulario();
    } catch (err: any) {
      console.error(err);
      this.error = 'Error al registrar la rutina en la base de datos.';
    }
  }

  limpiarFormulario() {
    this.nombre_rutina = '';
    this.nivel = 'Principiante';
    this.dia_semana = 'Lunes';
    this.archivo_url_resultado = '';
    this.duracion = '';
    this.frecuencia = '';
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
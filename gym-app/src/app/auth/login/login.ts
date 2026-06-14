import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  pass: string = '';
  error: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  async onLogin() {
    this.error = ''; // Limpiar errores previos

    if (!this.email || !this.pass) {
      this.error = 'Por favor, rellena todos los campos.';
      return;
    }

    try {
      const perfil = await this.authService.loginReal(this.email, this.pass);

      // 1. Control de seguridad por si el perfil devuelto es nulo
      if (!perfil) {
        this.error = 'No se encontró un perfil de atleta vinculado a esta cuenta.';
        return;
      }

      // Nota: La validación del estado 'Pendiente' permanece comentada/removida 
      // para permitirte ingresar directamente en tus pruebas locales.

      // 2. Guardamos la sesión local en el navegador
      localStorage.setItem('user_role', perfil.rol);
      localStorage.setItem('user_name', perfil.nombre_completo);
      localStorage.setItem('user_nivel', perfil.nivel);

      // 3. ¡CORRECCIÓN AQUÍ! Redirección usando segmentos separados 
      // para que Angular haga match perfecto con las rutas hijas de tu app.routes.ts
      if (perfil.rol === 'admin') {
        console.log('Acceso de Administrador correcto. Redirigiendo...');
        this.router.navigate(['/dashboard', 'admin']); 
      } else {
        console.log('Acceso de Atleta correcto. Redirigiendo...');
        this.router.navigate(['/dashboard', 'user']);  
      }

    } catch (err: any) {
      console.error('Error en el login:', err);
      this.error = 'Correo o contraseña incorrectos o problemas de conexión.';
    }
  }
}
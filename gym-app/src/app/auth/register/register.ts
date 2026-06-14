import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  // Propiedades vinculadas a los inputs del formulario mediante [(ngModel)]
  nombre_completo: string = '';
  telefono: string = '';
  email: string = '';
  pass: string = '';
  nivel: string = 'Principiante'; // Valor inicial por defecto
  plan_seleccionado: string = 'Básico'; // Valor inicial por defecto

  // Propiedad para capturar y mostrar errores en la interfaz oscura
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Si pasas el plan seleccionado como un parámetro en la URL (ej. /register?plan=Pro)
    // este bloque lo captura automáticamente para que aparezca preseleccionado.
    this.route.queryParamMap.subscribe(params => {
      const planParam = params.get('plan');
      if (planParam) {
        this.plan_seleccionado = planParam;
      }
    });
  }

  /**
   * Procesa el formulario de registro enviando las credenciales de Auth 
   * y los metadatos exactos que el TRIGGER SQL de Supabase está esperando.
   */
  async onRegister() {
    this.error = ''; // Limpiar errores previos

    // 1. Validación básica de que los campos obligatorios del formulario existan
    if (!this.nombre_completo || !this.telefono || !this.email || !this.pass) {
      this.error = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    try {
      // 2. Creamos el objeto con la estructura EXACTA que tu Trigger SQL va a buscar
      // dentro de: NEW.raw_user_meta_data->>'llave'
      const datosParaSupabase = {
        nombre: this.nombre_completo,       // Mapea a datos.nombre en tu AuthService
        telefono: this.telefono,           // Mapea a datos.telefono en tu AuthService
        plan: this.plan_seleccionado,       // Mapea a datos.plan en tu AuthService
        nivel: this.nivel || 'Principiante' // Si no seleccionó ninguno, enviamos el base
      };

      console.log('Enviando datos estructurados al servicio de GymPro:', datosParaSupabase);

      // 3. Llamamos al servicio pasando el correo, contraseña y el objeto estructurado
      await this.authService.registerClient(this.email, this.pass, datosParaSupabase);

      // 4. Si todo sale bien, mostramos confirmación y redirigimos al Login
      alert('¡Registro de atleta completado con éxito!');
      this.router.navigate(['/login']);

    } catch (err: any) {
      console.error('Error durante el proceso de registro:', err);
      
      // Manejo amigable de errores comunes de Supabase
      if (err.message?.includes('User already exists')) {
        this.error = 'El correo electrónico ya se encuentra registrado.';
      } else if (err.message?.includes('Password should be')) {
        this.error = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.message?.includes('rate limit exceeded')) {
        this.error = 'Se ha excedido el límite de registros por hora. Intenta de nuevo en unos minutos.';
      } else {
        this.error = err.message || 'Ocurrió un problema inesperado al registrar tu cuenta.';
      }
    }
  }
}
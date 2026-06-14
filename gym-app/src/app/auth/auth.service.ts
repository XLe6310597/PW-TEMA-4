import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Credenciales reales de tu proyecto GymPro en Supabase
  private supabaseUrl = 'https://sjdjcfkkxpxybcsvkpwt.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZGpjZmtreHB4eWJjc3ZrcHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzOTgzMTMsImV4cCI6MjA5Njk3NDMxM30.RvIbVVshMDNrFatv3YaPsx8u_lZHReDA_sNhTzI0L_8';
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  /**
   * Obtiene la sesión de autenticación activa de Supabase
   */
  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  /**
   * 1. Registro público del atleta
   * Envía las credenciales y los metadatos. El TRIGGER de tu base de datos 
   * se encarga de crear el renglón correspondiente en la tabla 'public.perfiles'.
   */
  async registerClient(email: string, pass: string, datos: { nombre: string, telefono: string, plan: string, nivel: string }) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: pass,
      options: {
        data: {
          nombre_completo: datos.nombre,     
          telefono: datos.telefono,           
          plan_seleccionado: datos.plan,     
          nivel: datos.nivel,                 
          estado: 'Activo', // Configurado como 'Activo' para tus pruebas inmediatas de ingreso
          rol: 'user'                         
        }
      }
    });
    if (error) throw error;
    return data;
  }

  /**
   * 2. Inicio de sesión general
   * Autentica al usuario y descarga los datos de su perfil extendido para gestionar accesos.
   */
  async loginReal(email: string, pass: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (authError) throw authError;

    // Consulta los detalles específicos dentro de la tabla perfiles
    const { data: perfil, error: perfilError } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('id', authData.user?.id)
      .single();

    if (perfilError) throw perfilError;
    return perfil;
  }

  /**
   * 3. Consulta de rutinas según el nivel (Principiante, Intermedio, Avanzado).
   */
  async obtenerRutinasPorNivel(nivel: string) {
    const { data, error } = await this.supabase
      .from('rutinas')
      .select('*')
      .eq('nivel', nivel);
    if (error) throw error;
    return data;
  }

  /**
   * 4. Panel Admin: Lista general de atletas registrados en el sistema.
   */
  async obtenerTodosLosPerfiles() {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .order('fecha_registro', { ascending: false });
    if (error) throw error;
    return data;
  }

  /**
   * 5. Panel Admin: Activación de cuenta (Alta) al validar el pago del atleta.
   */
  async activarAtleta(uid: string) {
    const { data, error } = await this.supabase
      .from('perfiles')
      .update({ estado: 'Activo' })
      .eq('id', uid);
    if (error) throw error;
    return data;
  }

  /**
   * Panel Admin: Publicación de registros de rutinas semanales
   */
  async crearNuevaRutina(rutina: { nombre_rutina: string, nivel: string, archivo_url: string, duracion?: string, frecuencia?: string }) {
    const { data, error } = await this.supabase
      .from('rutinas')
      .insert([rutina]);
    if (error) throw error;
    return data;
  }

  /**
   * 6. Sube un archivo físico al Storage de Supabase limpiando radicalmente su nombre y retorna su URL pública.
   */
  async subirPDFRutina(archivo: File): Promise<string> {
    // 1. Extraemos la extensión original (.pdf, .jpg, etc.)
    const extension = archivo.name.split('.').pop() || 'pdf';

    // 2. Limpiamos el nombre base quitando acentos y dejando SOLO letras y números puros
    const nombreBaseLimpio = archivo.name
      .split('.')[0]                         // Nos quedamos con el nombre sin extensión
      .normalize("NFD")                     // Descompone caracteres con acentos
      .replace(/[\u0300-\u036f]/g, "")     // Borra los acentos por completo
      .replace(/[^a-zA-Z0-9]/g, '_')       // Reemplaza CUALQUIER espacio o símbolo por un guion bajo
      .substring(0, 30);                   // Lo recortamos a 30 caracteres máximo para evitar nombres gigantes

    // 3. Armamos el nombre final ultra-seguro para la API de Supabase usando el timestamp único
    const nombreArchivo = `${Date.now()}_${nombreBaseLimpio}.${extension}`;

    console.log('🚀 Nombre definitivo enviado a Supabase:', nombreArchivo);

    // 4. Subir el archivo binario al bucket público 'rutinas-pdf' con upsert activo
    const { data, error } = await this.supabase
      .storage
      .from('rutinas-pdf')
      .upload(nombreArchivo, archivo, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('❌ Error detallado de Supabase Storage:', error);
      throw error;
    }

    // 5. Obtener y retornar la URL web pública
    const { data: publicUrlData } = this.supabase
      .storage
      .from('rutinas-pdf')
      .getPublicUrl(nombreArchivo);

    return publicUrlData.publicUrl;
  }

  /**
   * 7. Cierre de sesión seguro destruyendo el token en Supabase y limpiando el localStorage.
   */
  async logout() {
    await this.supabase.auth.signOut();
    localStorage.clear();
  }
}
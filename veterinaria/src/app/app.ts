import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { CafeteriaApi } from './services/cafeteria-api';
import {
  ContactoCafeteria,
  ProductoCafeteria,
  ResultadoActualizacion,
} from './models/cafeteria';

interface MensajeChat {
  id: number;
  tipo: 'asistente' | 'usuario';
  texto: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly api = inject(CafeteriaApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formatter = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    maximumFractionDigits: 2,
  });

  protected readonly contenido = signal<ResultadoActualizacion['data']>(undefined);
  protected readonly cargando = signal(true);
  protected readonly errorApi = signal(false);
  protected readonly reducirMovimiento = signal(false);
  protected readonly ultimaActualizacion = signal('');
  protected readonly menuAbierto = signal(false);
  protected readonly chatAbierto = signal(false);
  protected readonly chatOcupado = signal(false);
  protected readonly textoChat = signal('');
  protected readonly estadoContacto = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  protected readonly respuestaContacto = signal('');
  protected readonly mensajesChat = signal<MensajeChat[]>([
    {
      id: 0,
      tipo: 'asistente',
      texto: '¡Hola! Puedo ayudarte con el menú, los precios, los servicios y la ubicación.',
    },
  ]);
  protected readonly especialidades = computed(
    () => this.contenido()?.productos.filter((producto) => producto.destacada) ?? [],
  );
  private siguienteMensajeId = 1;

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      afterNextRender(() => {
        this.reducirMovimiento.set(
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        );
      });
      this.api
        .watchContent()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => this.actualizarContenido(result));
    }
  }

  protected toggleMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected closeMenu(): void {
    this.menuAbierto.set(false);
  }

  protected formatPrice(price: number): string {
    return this.formatter.format(price);
  }

  protected getMapsUrl(address: string | null): string {
    return `https://maps.google.com/?q=${encodeURIComponent(address ?? '')}`;
  }

  protected getWhatsAppUrl(phone: string | null): string | null {
    const digits = phone?.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : null;
  }

  protected sendContact(form: NgForm): void {
    if (form.invalid || this.estadoContacto() === 'sending') {
      form.control.markAllAsTouched();
      return;
    }

    const values = form.value;
    const contact: ContactoCafeteria = {
      nombre: String(values.nombre ?? '').trim(),
      email: String(values.email ?? '').trim(),
      telefono: String(values.telefono ?? '').trim() || null,
      mensaje: String(values.mensaje ?? '').trim(),
    };

    this.estadoContacto.set('sending');
    this.respuestaContacto.set('');
    this.api
      .sendContact(contact)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.estadoContacto.set('success');
          this.respuestaContacto.set(result.message);
          form.resetForm();
        },
        error: () => {
          this.estadoContacto.set('error');
          this.respuestaContacto.set(
            'No se pudo enviar el mensaje. Inténtalo nuevamente en unos minutos.',
          );
        },
      });
  }

  protected sendChat(): void {
    const question = this.textoChat().trim();
    if (!question || this.chatOcupado()) {
      return;
    }

    this.addChatMessage('usuario', question);
    this.textoChat.set('');
    this.chatOcupado.set(true);
    this.api
      .askChatbot(question)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.chatOcupado.set(false);
          this.addChatMessage(
            'asistente',
            result.response.trim() || 'El asistente devolvió una respuesta vacía.',
          );
        },
        error: () => {
          this.chatOcupado.set(false);
          this.addChatMessage(
            'asistente',
            'No pude conectar con el asistente en este momento. Inténtalo de nuevo más tarde.',
          );
        },
      });
  }

  protected trackProduct(_index: number, product: ProductoCafeteria): number {
    return product.id;
  }

  private actualizarContenido(result: ResultadoActualizacion): void {
    this.cargando.set(false);
    if (result.data) {
      this.contenido.set(result.data);
      this.errorApi.set(false);
      document.title = `${result.data.cafeteria.nombre} | Café de especialidad`;
      this.ultimaActualizacion.set(
        new Intl.DateTimeFormat('es-BO', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      );
      return;
    }
    this.errorApi.set(true);
  }

  private addChatMessage(tipo: MensajeChat['tipo'], texto: string): void {
    this.mensajesChat.update((messages) => [
      ...messages,
      { id: this.siguienteMensajeId++, tipo, texto },
    ]);
  }
}

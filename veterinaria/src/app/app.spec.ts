import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { CafeteriaApi } from './services/cafeteria-api';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: CafeteriaApi,
          useValue: {
            watchContent: () =>
              of({
                data: {
                  cafeteria: {
                    id: 1,
                    nombre: 'CoffeeHouse',
                    slogan: 'Café de especialidad',
                    descripcion: 'Una pausa para disfrutar.',
                    historia: 'Una historia de café.',
                    direccion: 'Cochabamba',
                    telefono: null,
                    correo: null,
                    horarios: null,
                    whatsapp: null,
                    instagram: null,
                    facebook: null,
                    video_url: null,
                    video_poster: null,
                    video_credit: null,
                    video_credit_url: null,
                  },
                  servicios: [],
                  productos: [],
                  galeria: [],
                },
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render cafeteria content received from the API', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero h1')?.textContent).toContain('CoffeeHouse');
    expect(compiled.textContent).toContain('Café de especialidad');
  });
});

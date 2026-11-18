import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import {
  ContactoCafeteria,
  ContenidoCafeteria,
  ResultadoActualizacion,
} from '../models/cafeteria';

@Injectable({
  providedIn: 'root',
})
export class CafeteriaApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/cafeteria';

  watchContent(): Observable<ResultadoActualizacion> {
    return timer(0, 5000).pipe(
      switchMap(() =>
        this.http.get<ContenidoCafeteria>(this.apiUrl).pipe(
          map((data) => ({ data })),
          catchError((error: unknown) => of({ error })),
        ),
      ),
    );
  }

  sendContact(contact: ContactoCafeteria): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/contacto`,
      contact,
    );
  }

  askChatbot(prompt: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>('/api/chatbot', { prompt });
  }
}

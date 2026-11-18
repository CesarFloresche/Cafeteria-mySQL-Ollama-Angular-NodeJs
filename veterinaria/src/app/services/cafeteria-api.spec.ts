import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CafeteriaApi } from './cafeteria-api';

describe('CafeteriaApi', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('refreshes content immediately and every five seconds', async () => {
    vi.useFakeTimers();
    const get = vi.fn().mockReturnValue(
      of({
        cafeteria: { id: 1, nombre: 'CoffeeHouse' },
        servicios: [],
        productos: [],
        galeria: [],
      }),
    );
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: { get } }],
    });

    const api = TestBed.inject(CafeteriaApi);
    const subscription = api.watchContent().subscribe();
    await vi.advanceTimersByTimeAsync(0);
    expect(get).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(4999);
    expect(get).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(get).toHaveBeenCalledTimes(2);
    subscription.unsubscribe();
  });
});

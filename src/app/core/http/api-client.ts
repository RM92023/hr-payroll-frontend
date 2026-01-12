import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url.token';

type Params = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class ApiClient {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  get<T>(path: string, params?: Params): Observable<T> {
    const httpParams = this.toParams(params);
    return this.http.get<T>(this.url(path), { params: httpParams });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path));
  }

  private url(path: string): string {
    const cleanBase = this.baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }

  private toParams(params?: Record<string, any>): HttpParams {
    let p = new HttpParams();
    if (!params) return p;
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue;
      p = p.set(k, String(v));
    }
    return p;
  }
}

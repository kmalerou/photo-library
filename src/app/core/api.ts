import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface ApiError {
  readonly status: number;
  readonly message: string;
}

export type ApiParams = Record<string, string | number>;

type HttpMethod = 'GET';

@Service()
export class Api {
  private readonly http = inject(HttpClient);

  get<T>(url: string, params?: ApiParams): Observable<T> {
    return this.request<T>('GET', url, params);
  }

  private request<T>(
    method: HttpMethod,
    url: string,
    params?: ApiParams,
  ): Observable<T> {
    const httpParams = params
      ? new HttpParams({ fromObject: params })
      : undefined;

    return this.http
      .request<T>(method, url, { params: httpParams })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => this.toApiError(error)),
        ),
      );
  }

  private toApiError(error: HttpErrorResponse): ApiError {
    return {
      status: error.status,
      message: error.message,
    };
  }
}

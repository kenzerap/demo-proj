import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly baseUrl = 'https://base-url.com/';
  private readonly http: HttpClient = inject(HttpClient);

  getProductList(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}product/list`);
  }
}

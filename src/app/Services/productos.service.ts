import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Productos } from '../Interfaces/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private urlAPI: string = environment.endpoint + "Producto/";

  constructor(private http: HttpClient) { }

  lista(page: number, pageSize: number, search: string = ''): Observable<ResponseApi> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('search', search);

    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`, { params });
  }

  listaTodos(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}ListaTodos`);
  }



  guardar(request: Productos): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlAPI}Guardar`, request)
  }

  editar(request: Productos): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`, request)
  }

  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${id}`)
  }
}

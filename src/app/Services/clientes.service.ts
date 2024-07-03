import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Clientes } from '../Interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private urlAPI: string = environment.endpoint + "Cliente/";
  private clientesSubject: BehaviorSubject<Clientes[]> = new BehaviorSubject<Clientes[]>([]);
  public clientes$: Observable<Clientes[]> = this.clientesSubject.asObservable();

  constructor(private http: HttpClient) { }

  lista(page: number, pageSize: number, search: string = ''): Observable<ResponseApi> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('search', search);

    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`, { params });
  }

  cargarClientes(page: number, pageSize: number, search: string = '') {
    this.lista(page, pageSize, search).subscribe({
      next: (data) => {
        if (data.status) {
          this.clientesSubject.next(data.value);
        } else {
          this.clientesSubject.next([]); // Asegurarse de manejar correctamente cuando no hay datos
          console.error('Error: No se encontraron datos');
        }
      },
      error: (e) => {
        this.clientesSubject.next([]); // Asegurarse de manejar correctamente el error
        console.error('Error al obtener los clientes', e);
      }
    });
  }


  // Nuevo método para obtener todos los clientes
  listaTodos(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}ListaTodos`);
  }

  cargarTodosClientes() {
    this.listaTodos().subscribe({
      next: (data) => {
        if (data.status) {
          this.clientesSubject.next(data.value);
        } else {
          this.clientesSubject.next([]); // Asegurarse de manejar correctamente cuando no hay datos
          console.error('Error: No se encontraron datos');
        }
      },
      error: (e) => {
        this.clientesSubject.next([]); // Asegurarse de manejar correctamente el error
        console.error('Error al obtener todos los clientes', e);
      }
    });
  }
}

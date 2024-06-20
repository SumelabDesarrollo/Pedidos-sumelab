import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Pedidos } from '../Interfaces/pedidos';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private urlAPI: string = environment.endpoint + "Pedido/";

  constructor(private http: HttpClient) { }

  registrar(request: Pedidos): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlAPI}Registrar`, request);
  }

  historial(buscarPor: string, fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}Historial?buscarPor=${buscarPor}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
  editar(request:Pedidos):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`,request)
  }
  eliminar(idPedido: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${idPedido}`);
  }
  actualizarEstado(idPedido: number, estado: string): Observable<ResponseApi> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.patch<ResponseApi>(`${this.urlAPI}ActualizarEstado/${idPedido}`, JSON.stringify(estado), { headers });
  }
  
}

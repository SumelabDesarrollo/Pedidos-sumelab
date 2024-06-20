import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { forkJoin } from 'rxjs';

import { ModalDetallePedidoComponent } from '../../Modales/modal-detalle-pedido/modal-detalle-pedido.component';
import { Pedidos } from '../../../../Interfaces/pedidos';
import { PedidosService } from '../../../../Services/pedidos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { Clientes } from '../../../../Interfaces/clientes';
import { ClientesService } from '../../../../Services/clientes.service';
import { ResponseApi } from '../../../../Interfaces/response-api';
import { ModalEditarPedidoComponent } from '../../Modales/modal-editar-pedido/modal-editar-pedido.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HistorialPedidosComponent implements OnInit, AfterViewInit {
  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: "fecha", descripcion: "Por fechas" }
  ];
  columnasTabla: string[] = ["cliente", "comercial", "fechaRegistro", "estado","Total", "accion"];
  dataInicio: Pedidos[] = [];
  listaClientes: Clientes[] = [];
  datosListaPedidos = new MatTableDataSource(this.dataInicio);
  clientesCargados: boolean = false;  // Variable para controlar la carga de clientes
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _pedidoServicio: PedidosService,
    private _clienteServicio: ClientesService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ["fecha"],
      fechaInicio: [""],
      fechaFin: [""]
    });

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        fechaInicio: "",
        fechaFin: ""
      });
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngAfterViewInit(): void {
    this.datosListaPedidos.paginator = this.paginacionTabla;
  }

  cargarClientes(): void {
    if (!this.clientesCargados) {
      this._clienteServicio.lista().subscribe({
        next: (data: ResponseApi) => {
          if (data.status) {
            this.listaClientes = data.value;
            this.clientesCargados = true;  // Marcar los clientes como cargados
            console.log('Clientes cargados:', this.listaClientes);  // Log para verificar los clientes cargados
            // Llamar a la búsqueda de pedidos después de cargar los clientes
            this.buscarPedidos();
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudieron cargar los clientes", "Oops");
          }
        },
        error: (e: any) => {
          console.error(e);
        }
      });
    } else {
      console.log('Clientes ya cargados:', this.listaClientes);
    }
  }

  aplicarFiltroTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaPedidos.filter = filterValue.trim().toLowerCase();
  }

  buscarPedidos(): void {
    let _fechaInicio: string = "";
    let _fechaFin: string = "";
    if (this.formularioBusqueda.value.buscarPor == "fecha") {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format("DD/MM/YYYY");
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format("DD/MM/YYYY");

      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops");
        return;
      }
    }

    if (!this.clientesCargados) {
      console.log("Los clientes aún no se han cargado. Por favor, espere...");
      return;
    }

    console.log('Buscando pedidos con fechas:', _fechaInicio, _fechaFin);
    this._pedidoServicio.historial(this.formularioBusqueda.value.buscarPor, _fechaInicio, _fechaFin).subscribe({
      next: (data: ResponseApi) => {
        if (data.status) {
          console.log('Pedidos recibidos:', data.value);
          console.log('Lista de clientes al buscar pedidos:', this.listaClientes);  // Log para verificar los clientes al buscar pedidos
          this.datosListaPedidos.data = data.value.map((pedido: Pedidos) => {
            const cliente = this.listaClientes.find(c => c.idcliente === pedido.idcliente);
            const clienteDisplayName = cliente ? cliente.name : 'Cliente desconocido';
            console.log('Procesando pedido:', pedido, 'Cliente encontrado:', cliente);
            return {
              ...pedido,
              clienteDisplayName,
              detallepedidos: pedido.detallepedidos
            };
          });
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops");
        }
      },
      error: (e: any) => {
        console.error(e);
      }
    });
  }

  verDetallePedido(_pedido: Pedidos): void {
    this.dialog.open(ModalDetallePedidoComponent, {
      data: _pedido,
      disableClose: true,
      width: "700px"
    });
  }
  

  editarPedido(_pedido: Pedidos): void {
    const dialogRef = this.dialog.open(ModalEditarPedidoComponent, {
      data: _pedido,
      disableClose: true,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buscarPedidos(); // Refrescar la lista de pedidos si se editó un pedido
      }
    });
  }

  eliminarPedido(_pedido: Pedidos): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el pedido con ID ${_pedido.idpedido}?`)) {
      this._pedidoServicio.eliminar(_pedido.idpedido).subscribe({
        next: (data: ResponseApi) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("Pedido eliminado exitosamente", "Hecho");
            this.buscarPedidos(); // Refrescar la lista de pedidos
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar el pedido", "Error");
          }
        },
        error: (e: any) => {
          console.error(e);
          this._utilidadServicio.mostrarAlerta("Hubo un error al eliminar el pedido", "Error");
        }
      });
    }
  }

  actualizarEstadoPedido(pedido: Pedidos, nuevoEstado: string): void {
    this._pedidoServicio.actualizarEstado(pedido.idpedido, nuevoEstado).subscribe({
      next: (data: ResponseApi) => {
        if (data.status) {
          this._utilidadServicio.mostrarAlerta("Estado actualizado exitosamente", "Hecho");
          this.buscarPedidos();
        } else {
          this._utilidadServicio.mostrarAlerta("No se pudo actualizar el estado", "Error");
        }
      },
      error: (e: any) => {
        console.error(e);
        this._utilidadServicio.mostrarAlerta("Hubo un error al actualizar el estado", "Error");
      }
    });
  }



  

  
}

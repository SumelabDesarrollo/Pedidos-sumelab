import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

import { ModalDetallePedidoComponent } from '../../Modales/modal-detalle-pedido/modal-detalle-pedido.component';
import { Pedidos } from '../../../../Interfaces/pedidos';
import { PedidosService } from '../../../../Services/pedidos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { Clientes } from '../../../../Interfaces/clientes';
import { ClientesService } from '../../../../Services/clientes.service';
import { ResponseApi } from '../../../../Interfaces/response-api';
import { ModalEditarPedidoComponent } from '../../Modales/modal-editar-pedido/modal-editar-pedido.component';
import { ProductosService } from '../../../../Services/productos.service';
import { Productos } from '../../../../Interfaces/productos';

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
  opcionesBusqueda: any[] = [{ value: "fecha", descripcion: "Por fechas" }];
  columnasTabla: string[] = ["cliente", "comercial", "fechaRegistro", "estado", "Total", "accion"];
  dataInicio: Pedidos[] = [];
  listaClientes: Clientes[] = [];
  listaProductos: Productos[] = [];
  datosListaPedidos = new MatTableDataSource<Pedidos>(this.dataInicio);
  clientesCargados: boolean = false;

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private pedidosService: PedidosService,
    private clientesService: ClientesService,
    private utilidadService: UtilidadService,
    private productosService: ProductosService
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
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    this.datosListaPedidos.paginator = this.paginacionTabla;
  }

  cargarClientes(): void {
    if (!this.clientesCargados) {
      this.clientesService.listaTodos().subscribe({
        next: (data: ResponseApi) => {
          if (data.status) {
            this.listaClientes = data.value;
            this.clientesCargados = true;
            console.log('Clientes cargados:', this.listaClientes);
            this.buscarPedidos();
          } else {
            this.utilidadService.mostrarAlerta("No se pudieron cargar los clientes", "Oops");
          }
        },
        error: (e: any) => {
          console.error('Error al obtener todos los clientes', e);
        }
      });
    } else {
      console.log('Clientes ya cargados:', this.listaClientes);
    }
  }

  cargarProductos(): void {
    this.productosService.listaTodos().subscribe({
      next: (data: ResponseApi) => {
        if (data.status) {
          this.listaProductos = data.value;
        } else {
          this.utilidadService.mostrarAlerta("No se pudieron cargar los productos", "Oops");
        }
      },
      error: (e: any) => {
        console.error('Error al obtener todos los productos', e);
        this.utilidadService.mostrarAlerta("Error al cargar productos", "Error");
      }
    });
  }

  aplicarFiltroTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaPedidos.filter = filterValue.trim().toLowerCase();
  }

  buscarPedidos(): void {
    let _fechaInicio: string = "";
    let _fechaFin: string = "";
    if (this.formularioBusqueda.value.buscarPor === "fecha") {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format("DD/MM/YYYY");
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format("DD/MM/YYYY");

      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this.utilidadService.mostrarAlerta("Debe ingresar ambas fechas", "Oops");
        return;
      }
    }

    if (!this.clientesCargados) {
      console.log("Los clientes aún no se han cargado. Por favor, espere...");
      return;
    }

    this.pedidosService.historial(this.formularioBusqueda.value.buscarPor, _fechaInicio, _fechaFin).subscribe({
      next: (data: ResponseApi) => {
        if (data.status) {
          this.datosListaPedidos.data = data.value.map((pedido: Pedidos) => {
            const cliente = this.listaClientes.find(c => c.idcliente === pedido.idcliente);
            const clienteDisplayName = cliente ? cliente.name : 'Cliente desconocido';
            return {
              ...pedido,
              clienteDisplayName,
              detallepedidos: pedido.detallepedidos
            };
          });
        } else {
          this.utilidadService.mostrarAlerta("No se encontraron datos", "Oops");
        }
      },
      error: (e: any) => {
        console.error(e);
      }
    });
  }

  verDetallePedido(pedido: Pedidos): void {
    this.dialog.open(ModalDetallePedidoComponent, {
      data: pedido,
      disableClose: true,
      width: "700px"
    });
  }

  editarPedido(pedido: Pedidos): void {
    const dialogRef = this.dialog.open(ModalEditarPedidoComponent, {
      data: pedido,
      disableClose: true,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buscarPedidos();
      }
    });
  }

  eliminarPedido(pedido: Pedidos): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el pedido con ID ${pedido.idpedido}?`)) {
      this.pedidosService.eliminar(pedido.idpedido).subscribe({
        next: (data: ResponseApi) => {
          if (data.status) {
            this.utilidadService.mostrarAlerta("Pedido eliminado exitosamente", "Hecho");
            this.buscarPedidos();
          } else {
            this.utilidadService.mostrarAlerta("No se pudo eliminar el pedido", "Error");
          }
        },
        error: (e: any) => {
          console.error(e);
          this.utilidadService.mostrarAlerta("Hubo un error al eliminar el pedido", "Error");
        }
      });
    }
  }

  actualizarEstadoPedido(pedido: Pedidos, nuevoEstado: string): void {
    const cliente = this.listaClientes.find(c => c.idcliente === pedido.idcliente);

    if (
      cliente?.estado === 'ACTIVO' &&
      cliente?.maximodias < 5 &&
      cliente?.saldo < parseFloat(cliente.creditLimit)
    ) {
      // Aquí ajustamos para verificar tanto slVirtualAvailable como la cantidad ordenada
      const detallesInvalidos = pedido.detallepedidos.filter(detalle =>
        parseFloat(detalle.slVirtualAvailable) <= 0 || detalle.qtyOrder > parseFloat(detalle.slVirtualAvailable)
      );

      if (detallesInvalidos.length === 0) {
        this.pedidosService.actualizarEstado(pedido.idpedido, nuevoEstado).subscribe({
          next: (data: ResponseApi) => {
            if (data.status) {
              this.utilidadService.mostrarAlerta("Estado actualizado exitosamente", "Hecho");
              this.buscarPedidos();
            } else {
              this.utilidadService.mostrarAlerta("No se pudo actualizar el estado", "Error");
            }
          },
          error: (e: any) => {
            console.error(e);
            this.utilidadService.mostrarAlerta("Hubo un error al actualizar el estado", "Error");
          }
        });
      } else {
        // Mapeamos los productos para obtener sus nombres
        const productosConProblemas = detallesInvalidos.map(detalle => {
          const producto = this.listaProductos.find(p => p.idProducto === detalle.idProducto);
          return producto ? producto.name : 'Producto desconocido';
        });
        const mensaje = `Los siguiente productos no tienen stock o excede la cantidad ordenada al stock disponible: ${productosConProblemas.join(', ')}`;
        this.utilidadService.mostrarAlerta(mensaje, "Error");
      }
    } else {
      // Mensaje de alerta si el cliente no cumple con los requisitos
      this.utilidadService.mostrarAlerta("No se cumple con los requisitos para confirmar la orden: Estado del Cliente: " + cliente?.estado + ", Días Vencidos: " + cliente?.maximodias + ", Saldo: " + cliente?.saldo, "Error");
    }
  }

}

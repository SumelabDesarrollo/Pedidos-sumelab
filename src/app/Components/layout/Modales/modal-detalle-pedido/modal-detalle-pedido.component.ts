// modal-detalle-pedido.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedidos } from '../../../../Interfaces/pedidos';
import { DetallePedidos } from '../../../../Interfaces/detalle-pedidos';
import { ProductosService } from '../../../../Services/productos.service';
import { Productos } from '../../../../Interfaces/productos';
import { ResponseApi } from '../../../../Interfaces/response-api';

@Component({
  selector: 'app-modal-detalle-pedido',
  templateUrl: './modal-detalle-pedido.component.html',
  styleUrls: ['./modal-detalle-pedido.component.css']
})
export class ModalDetallePedidoComponent implements OnInit {

  fechaRegistro: string = "";
  Cliente: string = "";
  Producto: string = "";
  Total: string = "";
  detallepedido: DetallePedidos[] = [];
  columnasTabla: string[] = ["Producto", "Incentivo", "PVF", "PVP", "Cantidad", "CantidadB", "Porcentaje", "Stock", "PrecioUnitario", "SubTotal", "Interes", "Total"];
  listaProductos: Productos[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public _pedido: Pedidos,
    private productosService: ProductosService
  ) {
    console.log('_pedido:', _pedido);
    this.fechaRegistro = _pedido.fechaCreacion || '';
    this.Total = _pedido.amountTotal || '';
    this.detallepedido = _pedido.detallepedidos || [];  // Verifica que _pedido.detallepedidos tenga datos válidos
  }



  ngOnInit(): void {
    this.detallepedido = this._pedido.detallepedidos || [];
    this.cargarProductos();
  }



  cargarProductos(): void {
    this.productosService.listaTodos().subscribe({
      next: (data: ResponseApi) => {
        console.log('Datos de productos recibidos:', data);
        if (data.status) {
          this.listaProductos = data.value;
          this.asociarNombresProductos();  // Asegúrate de que esta función se llame después de recibir los datos
        } else {
          console.error("No se encontraron productos");
        }
      },
      error: (e: any) => {
        console.error('Error al cargar productos:', e);
      }
    });
  }



  asociarNombresProductos(): void {
    console.log('this.listaProductos:', this.listaProductos);
    this.detallepedido = this.detallepedido.map(detalle => {
      const producto = this.listaProductos.find(p => p.idProducto === detalle.idProducto);
      return {
        ...detalle,
        displayName: producto ? producto.name : 'Producto desconocido'
      };
    });
  }


}

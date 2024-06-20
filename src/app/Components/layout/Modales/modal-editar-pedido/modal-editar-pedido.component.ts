import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PedidosService } from '../../../../Services/pedidos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ClientesService } from '../../../../Services/clientes.service';
import { ProductosService } from '../../../../Services/productos.service';
import { Clientes } from '../../../../Interfaces/clientes';
import { Productos } from '../../../../Interfaces/productos';
import { Pedidos } from '../../../../Interfaces/pedidos';
import { ResponseApi } from '../../../../Interfaces/response-api';

@Component({
  selector: 'app-modal-editar-pedido',
  templateUrl: './modal-editar-pedido.component.html',
  styleUrls: ['./modal-editar-pedido.component.css']
})
export class ModalEditarPedidoComponent implements OnInit {
  formularioEditar: FormGroup;
  listaClientes: Clientes[] = [];
  listaProductos: Productos[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pedidos,
    private dialogRef: MatDialogRef<ModalEditarPedidoComponent>,
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private utilidadService: UtilidadService,
    private clientesService: ClientesService,
    private productosService: ProductosService
  ) {
    this.formularioEditar = this.fb.group({
      idcliente: [data.idcliente],
      detallepedidos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.clientesService.lista().subscribe((response: ResponseApi) => {
      if (response.status) {
        this.listaClientes = response.value;
      }
    });

    this.productosService.lista().subscribe((response: ResponseApi) => {
      if (response.status) {
        this.listaProductos = response.value;
      }
    });

    this.data.detallepedidos.forEach(detalle => {
      this.detallesPedidos.push(this.fb.group({
        iddetallepedido: [detalle.iddetallepedido],
        idProducto: [detalle.idProducto],
        qtyOrder: [detalle.qtyOrder],
        // Otros campos que no se deben editar, pero deben mantenerse
        priceUnit: [detalle.priceUnit],
        slSubtotal: [detalle.slSubtotal],
        // Agrega aquí otros campos que no se deben editar
      }));
    });
  }

  get detallesPedidos(): FormArray {
    return this.formularioEditar.get('detallepedidos') as FormArray;
  }

  onSave(): void {
    if (this.formularioEditar.valid) {
      const pedidoEditado: Pedidos = {
        ...this.data,
        ...this.formularioEditar.value,
        detallepedidos: this.formularioEditar.value.detallepedidos.map((detalle: any, index: number) => ({
          ...this.data.detallepedidos[index], // Mantener otros campos del detalle que no se deben editar
          ...detalle
        }))
      };

      this.pedidosService.editar(pedidoEditado).subscribe({
        next: (response: ResponseApi) => {
          if (response.status) {
            this.utilidadService.mostrarAlerta("Pedido actualizado exitosamente", "Hecho");
            this.dialogRef.close(true);
          } else {
            this.utilidadService.mostrarAlerta("No se pudo actualizar el pedido", "Error");
          }
        },
        error: (error: any) => {
          console.error(error);
          this.utilidadService.mostrarAlerta("Hubo un error al actualizar el pedido", "Error");
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

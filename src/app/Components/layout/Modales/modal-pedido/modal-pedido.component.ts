import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productos } from '../../../../Interfaces/productos';
import { ProductosService } from '../../../../Services/productos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-modal-pedido',
  templateUrl: './modal-pedido.component.html',
  styleUrls: ['./modal-pedido.component.css']
})
export class ModalPedidoComponent implements OnInit {

  formularioPedido: FormGroup;
  listaProductos: Productos[] = [];
  listaProductosFiltrados: Productos[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosPedido: any,
    private fb: FormBuilder,
    private _productoServicio: ProductosService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioPedido = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      nxtIdErp: [''],
      listPrice: [''],
      slProductPvp: [''],
      stock: [''], // Campo de solo lectura
      taxesId: [''],
      estado : [''],// Campo de solo lectura
      slMarca: [''],
      presentacion:['']
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaProductos = data.value;
          this.listaProductosFiltrados = [...this.listaProductos];
        }
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void {
    if (this.datosPedido) {
      this.formularioPedido.patchValue({
        producto: this.datosPedido.producto,
        cantidad: this.datosPedido.cantidad
      });
    }

    // Escuchar cambios en el campo de búsqueda de producto
    this.formularioPedido.get('producto')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filtrarProductos(value);
      });
  }

  filtrarProductos(value: any): void {
    if (typeof value === 'string') {
      this.listaProductosFiltrados = this.listaProductos.filter(producto =>
        producto.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      console.error('Filter value is not a string:', value);
    }
  }

  mostrarProductos(producto: Productos): string {
    return producto ? producto.name : '';
  }

  productosParaPedido(event: any): void {
    const producto = event.option.value;
    this.formularioPedido.patchValue({
      producto: producto,
      nxtIdErp: producto.nxtIdErp,
      listPrice: producto.listPrice,
      slProductPvp: producto.slProductPvp,
      stock: producto.stock,
      taxesId: producto.taxesId,
      slMarca: producto.slMarca,
      estado: producto.estado,
      presentacion: producto.presentacion
    });
  }

  guardarPedido(): void {
    const productoSeleccionado = this.formularioPedido.value.producto;
    const cantidad = this.formularioPedido.value.cantidad;

    if (productoSeleccionado) {
      this.modalActual.close({ productoSeleccionado, cantidad });
    } else {
      console.log('No se ha seleccionado ningún producto');
    }
  }
}

import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productos } from '../../../../Interfaces/productos';
import { ProductosService } from '../../../../Services/productos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { MatPaginator } from '@angular/material/paginator';
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
  page: number = 1;
  pageSize: number = 10;
  search: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;

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

    this.cargarProductos();
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
        this.search = value;
        this.page = 1; // Reiniciar la paginación al buscar
        this.cargarProductos();
      });

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.page = this.paginator.pageIndex + 1;
        this.cargarProductos();
      });
    }
  }

  cargarProductos(): void {
    this._productoServicio.lista(this.page, this.pageSize, this.search).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaProductos = data.value as Productos[];
          this.listaProductosFiltrados = this.listaProductos.filter(p => p.estado === 'ACTIVO'); // Filtrar solo los productos activos
        }
      },
      error: (e) => { console.error('Error al obtener la lista de productos', e); }
    });
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

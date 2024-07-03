import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Productos } from '../../../../Interfaces/productos';
import { ProductosService } from '../../../../Services/productos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nxtIdErp', 'name', 'listPrice', 'slProductPvp', 'stock', 'taxesId', 'estado', 'slMarca', 'grupo', 'presentacion', 'fraccionador'];
  dataListaProductos = new MatTableDataSource<Productos>([]);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;
  page: number = 1;
  pageSize: number = 10;
  search: string = '';

  constructor(
    private dialog: MatDialog,
    private _productosServicio: ProductosService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.loadProductosPage();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
    this.paginacionTabla.page.subscribe(() => this.loadProductosPage());
  }

  loadProductosPage() {
    const pageIndex = this.paginacionTabla ? this.paginacionTabla.pageIndex : 0;
    const pageSize = this.paginacionTabla ? this.paginacionTabla.pageSize : this.pageSize;

    this._productosServicio.lista(pageIndex + 1, pageSize, this.search).subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaProductos.data = response.value;
        } else {
          this.dataListaProductos.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {
        this.dataListaProductos.data = [];
        console.error('Error al obtener los productos', e);
      }
    });
  }

  aplicarFiltroTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.search = filterValue.trim().toLowerCase();
    this.paginacionTabla.pageIndex = 0; // Reiniciar la paginación al buscar
    this.loadProductosPage();
  }

  nuevoProducto() {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.loadProductosPage();
    });
  }

  editarProducto(productos: Productos) {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: productos
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.loadProductosPage();
    });
  }

  eliminarProducto(productos: Productos) {
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: productos.name,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, Eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productosServicio.eliminar(productos.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado", "Listo!");
              this.loadProductosPage();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto", "Error!");
            }
          },
          error: (e) => {
            console.error('Error al eliminar el producto', e);
          }
        });
      }
    });
  }
}

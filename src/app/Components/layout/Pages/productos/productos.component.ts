import { Component,OnInit,AfterViewInit, ViewChild } from '@angular/core';

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
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit, AfterViewInit{
  
  columnasTabla: string[]  = ['nxtIdErp','name','listPrice','listPrice','slProductPvp','stock','taxesId','estado','slMarca','grupo','presentacion','fraccionador','acciones'];
  dataInicio: Productos[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  constructor(
    private dialog:MatDialog,
    private _productosServicio:ProductosService,
    private _utilidadServicio:UtilidadService

  ){}

  obtenerProductos(){
    this._productosServicio.lista().subscribe({
      next:(data) => {
        if(data.status)
           this.dataListaProductos.data = data.value;
          else
            this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
      },
      error:(e) =>{}
    })
  }

  ngOnInit(): void {
    this.obtenerProductos();
    
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }
  aplicarFiltroTable(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }
  nuevoProducto(){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true

    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerProductos();
    });

  }
  editarProducto(productos:Productos){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true,
      data: productos

    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerProductos();
    });

  }
  eliminarProducto(productos:Productos){
    Swal.fire({
      title:'¿Desea eliminar el producto?',
      text:productos.name,
      icon:"warning",
      confirmButtonColor:'#3085d6',
      confirmButtonText:"Si, Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#d33',
      cancelButtonText:"No, volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){

        this._productosServicio.eliminar(productos.idProducto).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado","Listo!");
              this.obtenerProductos();
            }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto","Error!");
          },
          error:(e)=>{}
        })
      }
    })
  }




}



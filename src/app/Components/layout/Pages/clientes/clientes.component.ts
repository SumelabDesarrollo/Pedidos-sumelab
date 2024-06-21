import { Component,OnInit,AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { ModalClientesComponent } from '../../Modales/modal-clientes/modal-clientes.component';
import { Clientes } from '../../../../Interfaces/clientes';
import { ClientesService } from '../../../../Services/clientes.service';

import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit, AfterViewInit{
  columnasTabla: string[]  = ['nxtIdErp','vat','name','xStudioNombreComercialSap','slClaCli','propertyPaymentTermId','creditLimit','userId','asesorCredito','asesorCallcenter','estado','saldo','maximodias'];
  dataInicio: Clientes[] = [];
  dataListaClientes = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  constructor(
    private dialog:MatDialog,
    private _clientesServicio:ClientesService,
    private _utilidadServicio:UtilidadService

  ){}

  obtenerClientes(){
    this._clientesServicio.lista().subscribe({
      next:(data) => {
        if(data.status)
           this.dataListaClientes.data = data.value;
          else
            this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
      },
      error:(e) =>{}
    })
  }

  ngOnInit(): void {
    this.obtenerClientes();
    
  }

  ngAfterViewInit(): void {
    this.dataListaClientes.paginator = this.paginacionTabla;
  }
  aplicarFiltroTable(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaClientes.filter = filterValue.trim().toLocaleLowerCase();
  }

}

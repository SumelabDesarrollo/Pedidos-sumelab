import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = ['nxtIdErp', 'vat', 'name', 'xStudioNombreComercialSap', 'slClaCli', 'propertyPaymentTermId', 'creditLimit', 'userId', 'asesorCredito', 'asesorCallcenter', 'estado', 'saldo', 'maximodias'];
  dataListaClientes = new MatTableDataSource<Clientes>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;
  page: number = 1;
  pageSize: number = 10;
  search: string = '';

  constructor(
    private dialog: MatDialog,
    private _clientesServicio: ClientesService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.loadClientesPage();
  }

  ngAfterViewInit(): void {
    this.dataListaClientes.paginator = this.paginator;
    this.paginator.page.subscribe(() => this.loadClientesPage());
  }

  loadClientesPage() {
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;

    this._clientesServicio.lista(pageIndex + 1, pageSize, this.search).subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaClientes.data = response.value;
        } else {
          this.dataListaClientes.data = [];
          console.error('Error: No se encontraron datos');
        }
      },
      error: (e) => {
        this.dataListaClientes.data = [];
        console.error('Error al obtener los clientes', e);
      }
    });
  }

  aplicarFiltroTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.search = filterValue.trim().toLowerCase();
    this.paginator.pageIndex = 0; // Reiniciar la paginación al buscar
    this.loadClientesPage();
  }
}

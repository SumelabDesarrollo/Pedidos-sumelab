import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ClientesComponent } from './Pages/clientes/clientes.component';
import { ProductosComponent } from './Pages/productos/productos.component';
import { PedidosComponent } from './Pages/pedidos/pedidos.component';
import { HistorialPedidosComponent } from './Pages/historial-pedidos/historial-pedidos.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalClientesComponent } from './Modales/modal-clientes/modal-clientes.component';
import { ModalDetallePedidoComponent } from './Modales/modal-detalle-pedido/modal-detalle-pedido.component';
import { ModalPedidoComponent } from './Modales/modal-pedido/modal-pedido.component';
import { ModalEditarPedidoComponent } from './Modales/modal-editar-pedido/modal-editar-pedido.component';
import { ScrollingModule } from '@angular/cdk/scrolling'; // Importar ScrollingModule

@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ClientesComponent,
    ProductosComponent,
    PedidosComponent,
    HistorialPedidosComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalClientesComponent,
    ModalDetallePedidoComponent,
    ModalPedidoComponent,
    ModalEditarPedidoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    SharedModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    ScrollingModule, // Agregar ScrollingModule aquí
  ]
})
export class LayoutModule { }

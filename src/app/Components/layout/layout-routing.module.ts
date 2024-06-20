import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ClientesComponent } from './Pages/clientes/clientes.component';
import { ProductosComponent } from './Pages/productos/productos.component';
import { PedidosComponent } from './Pages/pedidos/pedidos.component';
import { HistorialPedidosComponent } from './Pages/historial-pedidos/historial-pedidos.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';


const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    {path:'dashboard', component:DashBoardComponent},
    {path:'usuarios', component:UsuarioComponent},
    {path:'clientes', component:ClientesComponent},
    {path:'productos', component:ProductosComponent},
    {path:'pedidos', component:PedidosComponent},
    {path:'historial_pedidos', component:HistorialPedidosComponent},
    {path:'reportes', component:ReporteComponent},
  
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

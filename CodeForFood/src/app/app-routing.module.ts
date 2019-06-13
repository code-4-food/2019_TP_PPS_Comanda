import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SepararGuard } from './guard/separar.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate:[SepararGuard]
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'log-in', loadChildren: './paginas/log-in/log-in.module#LogInPageModule' },
  { path: 'alta-mesa', loadChildren: './paginas/alta-mesa/alta-mesa.module#AltaMesaPageModule' },
  { path: 'alta-supervisor', loadChildren: './paginas/alta-supervisor/alta-supervisor.module#AltaSupervisorPageModule' },
  { path: 'alta-empleado', loadChildren: './paginas/alta-empleado/alta-empleado.module#AltaEmpleadoPageModule' },
  { path: 'alta-producto', loadChildren: './paginas/alta-producto/alta-producto.module#AltaProductoPageModule' },
  { path: 'bar-cocina', loadChildren: './paginas/bar-cocina/bar-cocina.module#BarCocinaPageModule' },
  { path: 'bar-cocina-aceptados', loadChildren: './paginas/bar-cocina-aceptados/bar-cocina-aceptados.module#BarCocinaAceptadosPageModule' },
  { path: 'home-comanda', loadChildren: './paginas/home-comanda/home-comanda.module#HomeComandaPageModule' },
  { path: 'alta-cliente', loadChildren: './paginas/alta-cliente/alta-cliente.module#AltaClientePageModule' },
  { path: 'cuenta', loadChildren: './paginas/cuenta/cuenta.module#CuentaPageModule' },
  { path: 'home-cliente', loadChildren: './paginas/home-cliente/home-cliente.module#HomeClientePageModule' },
  { path: 'hacer-pedido', loadChildren: './paginas/hacer-pedido/hacer-pedido.module#HacerPedidoPageModule' },
  { path: 'home-metre', loadChildren: './paginas/home-metre/home-metre.module#HomeMetrePageModule' },
  { path: 'home-supervisor', loadChildren: './paginas/home-supervisor/home-supervisor.module#HomeSupervisorPageModule' },
  { path: 'aceptar-cliente', loadChildren: './paginas/aceptar-cliente/aceptar-cliente.module#AceptarClientePageModule' },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

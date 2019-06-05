import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'alta-supervisor',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
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
  { path: 'home-comanda', loadChildren: './paginas/home-comanda/home-comanda.module#HomeComandaPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

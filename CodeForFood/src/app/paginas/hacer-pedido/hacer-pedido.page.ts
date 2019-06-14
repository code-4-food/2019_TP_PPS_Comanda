import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/servicios/productos.service';
import { Producto } from 'src/app/interfaces/producto';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoProducto } from 'src/app/interfaces/pedido';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.page.html',
  styleUrls: ['./hacer-pedido.page.scss'],
})
export class HacerPedidoPage implements OnInit {
  public productos: Producto[];
  public cantidad: number;
  public pedido = {
    comienzo: (new Date()).toString(),
    estado: 'sconfirmar',
    id_mesa_cliente: ''
  };
  private pedidosProductos = [];
  public mesasClientes = [];
  private idUsusario = '';
  private usuario;
  public esMozo: boolean;

  constructor(private prodServ: ProductosService, private pedidoServ: PedidosService,
    private mesaServ: MesasService, private authServ: AuthService, private router: Router) {
    this.prodServ.getProductos().subscribe( (data) => {
      this.productos = data;
      console.log(data);
    });
    this.cantidad = 1;
    this.idUsusario = this.authServ.getUsuario()['id'];
    this.usuario = this.authServ.getUsuario();
    this.mesaServ.getMesasClientes().subscribe( (data) => {
      this.mesasClientes = data;
      if (this.usuario.perfil != 'cliente') {
        this.esMozo = true;
      } else {
        this.esMozo = false;
        for (const item of this.mesasClientes) {
          if (item.idCliente === this.idUsusario) {
            this.pedido.id_mesa_cliente = item.id;
            // console.log('encontro id mesa cliente', this.pedido);
            break;
          }
        }
      }
    });
  }
  ngOnInit() {
  }

  public Agregar(idProd: string) {
    console.log(idProd);
    if (this.cantidad > 0 ) {
      for (let index = 0; index < this.cantidad; index++) {
        const pedidoProd = {
          id_pedido: this.pedido['id'],
          estado: 'sconfirmar',
          id_producto: idProd,
          id_comanda: ''
        };
        this.pedidosProductos.push(pedidoProd);
      }
    }
  }
  public TerminarPedido() {
    if (this.pedidosProductos.length > 0 ) {
      if (this.usuario.perfil != 'cliente' && this.pedido.id_mesa_cliente != '') {
        this.pedidoServ.AddPedido(this.pedido).then( (res) => {
          this.pedido['id'] = res['id'];
          console.log(this.pedido);
          for (const item of this.pedidosProductos) {
            item.id_pedido = res['id'];
            this.pedidoServ.AddPedidoProducto(item).then( (res) => {
              console.log('agregado');
            });
          }
          alert('pedido agregado!');
          if ( this.usuario.perfil == 'cliente' ) {
            this.router.navigate(['/home-cliente']);
          } else {
            this.router.navigate(['/home-mozo']);
          }
        });
      } else {
        alert('No selecciono mesa para el pedido');
      }
    }
  }
  public LeerQR() {
    
  }
}

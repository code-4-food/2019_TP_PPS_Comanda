import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/usuario';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { MesasService } from 'src/app/servicios/mesas.service';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit {
  public pedidos = [];
  public productos = [];
  public pedprod = [];
  public mesasClientes = [];
  public pedidosAceptar = [];
  public aceptarPedidos = false;
  private empleado: Empleado;
  private mesas = [];

  constructor(private pedidosServ: PedidosService,
    private auth: AuthService, private router: Router,
    private mesasServ: MesasService) {

    // this.empleado = this.auth.getUsuario();
    this.pedidosServ.getPedidos().subscribe( (data) => {
      this.pedidos = data;
      console.log('pedidos: ', this.pedidos);
      this.pedidosServ.getPedidoProductos().subscribe( (pedproduc) => {
        this.pedprod = pedproduc;
        console.log('pedprod: ', this.pedprod);
        this.pedidos.forEach(pedido => {
          let ppigual = 0;
          let ppterminado = -1;
          this.pedprod.forEach(pp => {
            if (pedido.id == pp.id_pedido) {
              ppigual++;
              if (pp.estado != 'terminado') {
                ppterminado++;
              }
            }
          });
          if (ppigual == ppterminado-1 && ppterminado>-1) {
            pedido.estado = 'terminado';
            console.log('terminado');
            this.pedidosServ.updatePedido(pedido.id, pedido);
          }
        });
      });
    });
    this.pedidosServ.getProductos().subscribe( (data) => {
      this.productos = data;
      console.log('productos: ', this.productos);
    });
    this.mesasServ.getMesasClientes().subscribe( (data) => {
      this.mesasClientes = data;
      console.log('mesas-clientes: ', this.mesasClientes);
    });
    this.mesasServ.getMesas().subscribe( (data) => {
      this.mesas = data;
      console.log('mesas: ', this.mesas);
    });
  }

  ngOnInit() {
  }
  public HacerPedido() {
    this.router.navigate(['/hacer-pedido']);
  }
  public TerminarPedido(idPedido: string) {
    this.pedidos.forEach(pedido => {
      if (pedido.id === idPedido) {
        pedido.estado = 'entregadosconfirmar';
        this.pedprod.forEach(pp => {
          if (pp['id_pedido'] === pedido.id) {
            pp.estado = 'entregado';
            this.pedidosServ.updatePedidoProducto(pp.id, pp);
          }
        });
        this.pedidosServ.updatePedido(idPedido, pedido);
      }
    });
  }
  public AceptarPedido(idPedido: string) {
    this.pedidos.forEach(pedido => {
      if (pedido.id === idPedido) {
        pedido.estado = 'preparacion';
        this.mesasClientes.forEach(mesaCl => {
          if (mesaCl.id === pedido.id_mesa_cliente) {
            this.mesas.forEach(mesas => {
              if (mesas.id === mesaCl.idMesa) {
                mesas.estado = 'esperando pedido';
                this.mesasServ.updateMesa(mesas).then( () => { console.log('mesa updated'); } );
              }
            });
          }
        });
        this.pedprod.forEach(pp => {
          if (pp['id_pedido'] === pedido.id) {
            pp.estado = 'esperando';
            this.pedidosServ.updatePedidoProducto(pp.id, pp);
          }
        });
        this.pedidosServ.updatePedido(idPedido, pedido);
      }
    });
  }
  public ConfirmarPago() {
    this.router.navigate(['/cuenta']);
  }
}

import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { ProductosService } from 'src/app/servicios/productos.service';
import { MesasService } from 'src/app/servicios/mesas.service';

@Component({
  selector: 'app-mozo-aceptar',
  templateUrl: './mozo-aceptar.page.html',
  styleUrls: ['./mozo-aceptar.page.scss'],
})
export class MozoAceptarPage implements OnInit {
  public pedidos = [];
  public mesasClientes = [];
  public pedidosProductos = [];
  public productos = [];
  private mesas = [];

  constructor(private pedidosServ: PedidosService, private prodServ: ProductosService,
    private mesasServ: MesasService) {
      this.pedidosServ.getPedidos().subscribe( (data) => {
        this.pedidos = data;
        console.log('pedidos: ', this.pedidos);
      });
      this.pedidosServ.getPedidoProductos().subscribe( (pedproduc) => {
        this.pedidosProductos = pedproduc;
        console.log('pedidos-productos: ', this.pedidosProductos);
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

  public BorrarPedido(idPedido: string, idMesaCliente: string) {
    this.mesasClientes.forEach(mesaCl => {
      if (mesaCl.id === idMesaCliente) {
        this.mesas.forEach(mesas => {
          if (mesas.id === mesaCl.idMesa) {
            mesas.estado = 'realizando pedido';
            this.mesasServ.updateMesa(mesas).then( () => { console.log('mesa updated'); } );
          }
        });
      }
    });
    this.pedidosServ.DeletePedido(idPedido).then( () => { console.log('pedido borrado'); });
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
        this.pedidosProductos.forEach(pp => {
          if (pp.id_pedido === pedido.id) {
            pp.estado = 'esperando';
            this.pedidosServ.updatePedidoProducto(pp.id, pp);
          }
        });
        this.pedidosServ.updatePedido(idPedido, pedido);
      }
    });
  }
}

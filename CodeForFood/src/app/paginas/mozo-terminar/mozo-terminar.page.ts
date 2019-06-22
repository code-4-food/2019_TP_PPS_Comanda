import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { ProductosService } from 'src/app/servicios/productos.service';
import { database } from 'firebase';

@Component({
  selector: 'app-mozo-terminar',
  templateUrl: './mozo-terminar.page.html',
  styleUrls: ['./mozo-terminar.page.scss'],
})
export class MozoTerminarPage implements OnInit {
  public pedidos = [];
  public mesasClientes = [];
  public pedidosProductos = [];
  public productos = [];
  private mesas = [];

  constructor(private pedidosServ: PedidosService, private mesasServ: MesasService,
    private prodSev: ProductosService) {
      this.mesasServ.getMesas().subscribe( (data) => {
        this.mesas = data;
      });
      this.mesasServ.getMesasClientes().subscribe( (data) => {
        this.mesasClientes = data;
      });
      this.prodSev.getProductos().subscribe( (data) => {
        this.productos = data;
      });
      this.pedidosServ.getPedidos().subscribe( (dat) => {
        this.pedidos = dat;
        this.pedidosServ.getPedidosProductos().subscribe( (data) => {
          this.pedidosProductos = data;
          this.pedidos.forEach(pedido => {
            let ppigual = 0;
            let ppterminado = -1;
            this.pedidosProductos.forEach(pp => {
              if (pedido.id == pp.id_pedido) {
                ppigual++;
                if (pp.estado == 'terminado') {
                  ppterminado++;
                }
              }
            });
            if (ppterminado == (ppigual-1) && ppterminado>-1) {
              pedido.estado = 'terminado';
              this.pedidosServ.updatePedido(pedido.id, pedido);
            }
          });
        });
      });
    }

  ngOnInit() {
  }

  public EntregarPedido(idPedido: string) {
    this.pedidos.forEach(pedido => {
      if (pedido.id === idPedido) {
        pedido.estado = 'entregadosconfirmar';
        this.pedidosProductos.forEach(pp => {
          if (pp.id_pedido === pedido.id) {
            pp.estado = 'entregado';
            this.pedidosServ.updatePedidoProducto(pp.id, pp);
          }
        });
        this.pedidosServ.updatePedido(idPedido, pedido);
      }
    });
  }
}

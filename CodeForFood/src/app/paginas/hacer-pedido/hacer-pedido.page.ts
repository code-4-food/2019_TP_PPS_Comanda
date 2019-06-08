import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/servicios/productos.service';
import { Producto } from 'src/app/interfaces/producto';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoProducto } from 'src/app/interfaces/pedido';
import { PedidosService } from 'src/app/servicios/pedidos.service';

@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.page.html',
  styleUrls: ['./hacer-pedido.page.scss'],
})
export class HacerPedidoPage implements OnInit {
  public productos: Producto[];
  public cantidad: number;
  private pedido = {
    comienzo: (new Date()).toString(),
    estado: 'preparacion',
    id_mesa_cliente: '',
    id_mozo: ''
  };
  private pedidosProductos = [];

  constructor(private prodServ: ProductosService, private pedidoServ: PedidosService) {
    this.prodServ.getProductos().subscribe( (data) => {
      this.productos = data;
      console.log(data);
    });
    this.cantidad = 1;
  }
  ngOnInit() {
  }

  public Agregar(idProd: string) {
    console.log(idProd);
    if (this.cantidad > 0 ) {
      for (let index = 0; index < this.cantidad; index++) {
        const pedidoProd = {
          id_pedido: this.pedido['id'],
          estado: 'esperando',
          id_producto: idProd,
          id_comanda: '??????'
        };
        this.pedidosProductos.push(pedidoProd);
      }
    }
  }
  public TerminarPedido() {
    if (this.pedidosProductos.length > 0 ) {
      this.pedidoServ.AddPedido(this.pedido).then( (res) => {
        this.pedido['id'] = res['id'];
        console.log(this.pedido);
      });
      for (const item of this.pedidosProductos) {
        this.pedidoServ.AddPedidoProducto(item).then( (res) => {
          console.log('agregado');
        });
      }
    }
  }
  public LeerQR() {
    
  }
}

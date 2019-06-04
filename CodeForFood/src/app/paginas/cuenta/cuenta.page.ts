import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../servicios/pedidos.service';
import { ProductosService } from '../../servicios/productos.service';
import { Pedido } from 'src/app/interfaces/pedido';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  public id = '';
  private pedidoSelecc: Pedido;
  private pedidosproductos: any;
  public pedidos: any;
  private productos: any;
  public productosCuenta = [];
  public total = 0;

  constructor(private pedidosServ: PedidosService, private productosServ: ProductosService) {
    this.pedidosServ.getPedidos().subscribe( (data) => {
      this.pedidos = data;
      console.log('pedidos: ', this.pedidos);
    });
    this.pedidosServ.getPedidosProductos().subscribe( (data) => {
      this.pedidosproductos = data;
      console.log('pedidos-productos: ', this.pedidosproductos);
    });
    this.pedidosServ.getProductos().subscribe( (data) => {
      this.productos = data;
      console.log('productos: ', this.productos);
    });
  }

  ngOnInit() {
  }

  public CargarCuenta() {
    this.total = 0;
    if (this.id !== '') {
      this.pedidos.forEach( p => {
        if (p['id'] == this.id) {
          this.pedidoSelecc = p;
          this.pedidosproductos.forEach( pp => {
            if (p['id'] == pp['id-pedido']) {
              this.productos.forEach( prod => {
                if (prod['id'] == pp['id-producto']) {
                  this.productosCuenta.push(prod);
                  this.total += Number.parseInt(prod['precio']);
                }
              });
            }
          });
        }
      });
      console.log(this.productosCuenta);
    }
  }
  public Pagada() {
    this.pedidosServ.PagarPedido(this.pedidoSelecc).then( data => {
      console.log('pagado');
    });
  }

}

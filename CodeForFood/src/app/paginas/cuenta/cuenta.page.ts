import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../servicios/pedidos.service';
import { ProductosService } from '../../servicios/productos.service';
import { Pedido } from 'src/app/interfaces/pedido';
import { MesasService } from 'src/app/servicios/mesas.service';
import { MesaCliente } from 'src/app/interfaces/mesa-cliente';
import { Mesa } from 'src/app/interfaces/mesa';

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
  public mesas = [];

  constructor(private pedidosServ: PedidosService, private mesasServ: MesasService) {
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
    this.mesasServ.getMesas().subscribe( (data) => {
      this.mesas = data;
      console.log('mesas: ', this.mesas);
    });
  }

  ngOnInit() {
  }

  public CargarCuenta() {
    this.total = 0;
    if (this.id !== '') {
      this.mesas.forEach( m => {
        if (m['numero'] == this.id) {
          this.pedidos.forEach( p => {
            if (p['id-mesa-cliente'] == m['id']) {
              this.pedidoSelecc = p;
              this.pedidosproductos.forEach( pp => {
                if (p['id'] == pp['id_pedido']) {
                  this.productos.forEach( prod => {
                    if (prod['id'] == pp['id_producto']) {
                      this.productosCuenta.push(prod);
                      this.total += Number.parseInt(prod['precio']);
                    }
                  });
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
    this.mesasServ.getMesaClientePorID(this.pedidoSelecc.id_mesa_cliente).then( (data) => {
      let mesaCliente: MesaCliente = data[0];
      mesaCliente.cerrada = true;
      this.mesasServ.updateMesaCliente(mesaCliente);
    });
    this.mesasServ.getMesaPorID(this.pedidoSelecc.id_mesa).then( (data) => {
      let mesa: Mesa = data[0];
      mesa.estado = 'disponible';
      this.mesasServ.updateMesa(mesa);
    });
  }

}

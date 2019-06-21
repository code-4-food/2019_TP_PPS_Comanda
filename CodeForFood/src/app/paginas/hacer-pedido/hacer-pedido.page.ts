import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/servicios/productos.service';
import { Producto } from 'src/app/interfaces/producto';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoProducto } from 'src/app/interfaces/pedido';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertService } from 'src/app/servicios/alert.service';

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
    id_mesa_cliente: '',
    'id-mesa': ''
  };
  public pedidosProductos = [];
  public mesasClientes = [];
  private idUsusario = '';
  private usuario;
  public esMozo: boolean;

  constructor(private prodServ: ProductosService, private pedidoServ: PedidosService,
    private mesaServ: MesasService, private authServ: AuthService,
    private router: Router, private barcodeScanner: BarcodeScanner, 
    private alertServ: AlertService) {
    this.prodServ.getProductos().subscribe( (data) => {
      this.productos = data;
      // console.log(data);
    });
    this.cantidad = 1;
  }
  ngOnInit() {
    this.idUsusario = this.authServ.getUsuario()['id'];
    this.usuario = this.authServ.getUsuario();
    this.mesaServ.getMesasClientes().subscribe( (data) => {
      this.mesasClientes = data;
      if (this.usuario.perfil != 'cliente' && this.usuario.perfil != 'anonimo') {
        this.esMozo = true;
      } else {
        this.esMozo = false;
        for (const item of this.mesasClientes) {
          if (item.idCliente === this.idUsusario) {
            this.pedido.id_mesa_cliente = item.id;
            break;
          }
        }
      }
    });
  }

  public Agregar(idProd: string) {
    console.log(idProd);
    if (this.cantidad > 0 ) {
      for (let index = 0; index < this.cantidad; index++) {
        const pedidoProd = {
          id_pedido: this.pedido['id'],
          estado: 'sconfirmar',
          id_producto: idProd,
          id_comanda: '',
          cantidad: this.cantidad
        };
        this.pedidosProductos.push(pedidoProd);
      }
    }
    this.cantidad = 1;
  }
  public TerminarPedido() {
    if (this.pedidosProductos.length > 0 ) {
      // console.log(this.pedido.id_mesa_cliente);
      if (this.pedido.id_mesa_cliente != '') {
        this.mesasClientes.forEach(mCliente => {
          if (mCliente.id == this.pedido.id_mesa_cliente) {
            this.pedido['id-mesa'] = mCliente.idMesa;
          }
        });
        this.pedidoServ.AddPedido(this.pedido).then( (res) => {
          this.pedido['id'] = res['id'];
          // console.log(this.pedido);
          for (const item of this.pedidosProductos) {
            item.id_pedido = res['id'];
            this.pedidoServ.AddPedidoProducto(item).then( (res) => {
              console.log('agregado');
            });
          }
          this.alertServ.mensaje('', 'El pedido se agregó correctamente');
          if ( this.usuario.perfil == 'cliente' || this.usuario.perfil == 'anonimo') {
            this.router.navigate(['/home-cliente']);
          } else {
            this.router.navigate(['/mozo-aceptar']);
          }
        });
      } else {
        this.alertServ.mensaje('Empleado:', 'No seleccionó mesa para el pedido!');
      }
    }
  }
  public BorrarProducto(idProducto: string) {
    console.log(this.pedidosProductos);
    for (const pp of this.pedidosProductos) {
      if (pp.id_producto == idProducto) {
        const index = this.pedidosProductos.indexOf(pp);
        this.pedidosProductos.splice(index, 1);
        break;
      }
    }
  }
  public LeerQR() {
    this.barcodeScanner.scan().then(resultado => {
      this.productos.forEach(producto => {
        if (producto.qr == resultado.text) {
          this.Agregar(producto.id);
        }
      });
    });
  }
}

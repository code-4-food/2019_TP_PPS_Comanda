import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../servicios/pedidos.service';
import { ProductosService } from '../../servicios/productos.service';
import { Pedido } from 'src/app/interfaces/pedido';
import { MesasService } from 'src/app/servicios/mesas.service';
import { MesaCliente } from 'src/app/interfaces/mesa-cliente';
import { Mesa } from 'src/app/interfaces/mesa';
import { AuthService } from 'src/app/servicios/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ErrorService } from 'src/app/servicios/error.service';
import { Router } from '@angular/router';

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
  public mesasClientes = [];
  private mesas = [];
  public empleado: any;
  public esMozo = false;
  public propina = 0;

  constructor(private pedidosServ: PedidosService, private mesasServ: MesasService,
    private authService: AuthService, private barcodeScanner: BarcodeScanner,
    private errorHand: ErrorService, private router: Router) {
    this.empleado = this.authService.getUsuario();
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
    this.mesasServ.getMesasClientes().subscribe( (data) => {
      this.mesasClientes = data;
      console.log('mesas-clientes: ', this.mesasClientes);
      if (this.empleado.perfil !== 'cliente') {
        this.esMozo = true;
      } else {
        this.total = 0;
        this.mesasClientes.forEach(m => {
          if (m.idCliente === this.empleado.id) {
            this.id = m.idMesa;
            console.log(this.id);
          }
        });
        this.CargarCuenta();
        console.log(this.productosCuenta);
      }
    });
    this.mesasServ.getMesas().subscribe( (data) => {
      this.mesas = data;
    });
  }

  ngOnInit() {
  }

  public CargarCuenta() {
    this.total = 0;
    this.productosCuenta = [];
    if (this.id !== '') {
      this.mesasClientes.forEach( m => {
        if (m.idMesa === this.id) {
          this.pedidos.forEach( p => {
            if (p.id_mesa_cliente === m.id) {
              this.pedidoSelecc = p;
              this.pedidosproductos.forEach( pp => {
                if (p.id === pp.id_pedido) {
                  this.productos.forEach( prod => {
                    if (prod.id === pp.id_producto) {
                      this.productosCuenta.push(prod);
                      this.total += Number.parseInt(prod['precio']);
                      this.propina = m.propina;
                    }
                  });
                }
              });
            }
          });
        }
      });
      if (this.empleado.perfil !== 'cliente' && this.propina !== 0) {
        this.total *= this.propina;
      }
      console.log(this.productosCuenta);
    }
  }
  public Pagada() {
    // console.log(this.pedidoSelecc);
    this.mesasClientes.forEach(mesaCl => {
      if (mesaCl.id === this.pedidoSelecc.id_mesa_cliente) {
        mesaCl.cerrada = true;
        this.mesasServ.updateMesaCliente(mesaCl);
        console.log(mesaCl);
        this.mesas.forEach(mesa => {
          if (mesa.id === mesaCl.idMesa) {
            mesa.estado = 'disponible';
            this.mesasServ.updateMesa(mesa);
            console.log(mesa);
            alert('listo, mesa disponible y mesacliente cerrada');
            this.router.navigate(['/home-mozo']);
          }
        });
      }
    });
  }
  public Propina() {
    this.barcodeScanner.scan().then(barcodeData => {
      // alert(barcodeData.text);
      if (barcodeData.text === 'malo') {
        this.GuardarPropina(1);
      } else if (barcodeData.text === 'regular') {
        this.total *= 1.05;
        this.GuardarPropina(1.05);
      } else if (barcodeData.text === 'bien') {
        this.total *= 1.10;
        this.GuardarPropina(1.10);
      } else if (barcodeData.text === 'muy bien') {
        this.total *= 1.15;
        this.GuardarPropina(1.15);
      } else if (barcodeData.text === 'excelente') {
        this.total *= 1.20;
        this.GuardarPropina(1.20);
      } else {
        alert('codigo no valido');
      }
    }).catch(err => {
      this.errorHand.MostrarErrorSoloLower('Error: ' + err);
      console.log('Error', err);
    });
  }
  private GuardarPropina(propina: number) {
    this.propina = propina;
    this.mesasClientes.forEach(mesaCl => {
      if (mesaCl.idCliente === this.empleado.id) {
        mesaCl.propina = propina;
        this.mesasServ.updateMesaCliente(mesaCl);
      }
    });
  }

}

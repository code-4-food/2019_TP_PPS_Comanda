import { PedidosService } from './../../servicios/pedidos.service';
import { Pedido } from 'src/app/interfaces/pedido';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MesasService } from './../../servicios/mesas.service';
import { Mesa } from './../../interfaces/mesa';
import { Reserva } from 'src/app/interfaces/reserva';
import { ReservasService } from 'src/app/servicios/reservas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage {
  public mesas: Mesa[];
  public reservas: Reserva[];
  public usuario: any;
  public pedido: any;

  constructor(private platform: Platform, private barcodeScanner: BarcodeScanner, private reservasService: ReservasService,
    private mesasService: MesasService, private pedidosService: PedidosService, private router: Router) {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    this.mesasService.getMesas().subscribe(mesas => {
      this.mesas = mesas;
    });

    this.reservasService.getReservas().subscribe(reservas => {
      this.reservas = reservas;
    });
  }

  public EscannerQR() {
    this.barcodeScanner.scan().then(resultado => {
      let qrValido = false;

      this.mesas.forEach(async mesa => {
        if (resultado.text === mesa.qr) {
          qrValido = true;

          switch (mesa.estado) {
            case 'disponible':
              if (confirm('La mesa se encuentra disponible! Desea solicitar esta mesa?')) {
                mesa.estado = 'realizando pedido';
                await this.mesasService.updateMesa(mesa).catch(error => {
                  alert(error);
                });

                this.mesasService.asignarMesa({
                  cerrada: false,
                  idCliente: this.usuario.id,
                  idMesa: mesa.id,
                  idMozo: '',
                  juegoBebida: false,
                  juegoDescuento: false,
                  juegoPostre: false,
                  propina: 0
                });
              }

              break;
            case 'reservada':
              // Falta verificar si hay una reserva en los próximos 40 minutos de esta mesa
              // Si hay reserva, verificar si está a nombre del usuario que scanea el código
              alert('Esta mesa se encuentra reservada');
              break;
            case 'realizando pedido':
              alert('Ya puede realizar su pedido!');
              break;
            case 'esperando pedido':
              // Falta mostrar todo el detalle de cada producto del pedido
              await this.pedidosService.getPedido(mesa.id).then(pedidos => {
                pedidos.map(pedido => {
                  this.pedido = pedido;

                  switch (pedido.estado) {
                    case 'preparacion':
                      alert('Su pedido se encuentra en preparación');
                      break;
                    case 'finalizado':
                      alert('Su pedido ya fue preparado y el mozo está por llevarselo a su mesa');
                      break;
                    case 'entregado':
                      alert('Su pedido ya fue entregado');
                      break;
                  }
                });
              });

              break;
            case 'comiendo':
              if (confirm('Espero que esté disfrutando su pedido. Desea dejarnos comentarios acerca de su experiencia?')) {
                // Mostrar encuesta
              }

              break;
            case 'esperando cuenta':
              if (confirm('Espero que haya disfrutado de su pedido. Desea dejarnos comentarios acerca de su experiencia?')) {
                // Mostrar encuesta
              }

              break;
          }
        }
      });

      if (!qrValido) {
        alert('Código QR inválido!');
      }
    });
  }

  public RealizarPedido() {
    this.router.navigate(['/hacer-pedido']);
  }

  public ConfirmarRecepcion() { }

  public PedirCuenta() { }

  public RealizarReserva() { }

  public Jugar() { }
}

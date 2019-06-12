import { MesaCliente } from './../../interfaces/mesa-cliente';
import { Espera } from './../../interfaces/reserva';
import { PedidosService } from './../../servicios/pedidos.service';
import { Pedido } from 'src/app/interfaces/pedido';
import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MesasService } from './../../servicios/mesas.service';
import { Mesa } from './../../interfaces/mesa';
import { Reserva } from 'src/app/interfaces/reserva';
import { ReservasService } from 'src/app/servicios/reservas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage {
  public mesas: Mesa[];
  public reservas: Reserva[];
  public listaEspera: Espera[];
  public mesasClientes: MesaCliente[];
  public usuario: any;
  public pedido: any;

  constructor(private platform: Platform, private barcodeScanner: BarcodeScanner, private reservasService: ReservasService,
    private mesasService: MesasService, private pedidosService: PedidosService, private authService: AuthService, private route:Router,
    public alertController: AlertController) {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    this.mesasService.getMesas().subscribe(mesas => { this.mesas = mesas; });
    this.mesasService.getMesasClientes().subscribe(mesasClientes => { this.mesasClientes = mesasClientes; });
    this.reservasService.getReservas().subscribe(reservas => { this.reservas = reservas; });
    this.reservasService.getListaEspera().subscribe(listaEspera => { this.listaEspera = listaEspera; });
  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: 'Cuantas personas son?',
      inputs: [
        {
          name: 'Uno - - - - - 1',
          type: 'radio',
          label: 'Uno - - - - - 1',
          value: 1,
          checked: true
        },
        {
          name: 'Dos - - - - - 2',
          type: 'radio',
          label: 'Dos - - - - - 2',
          value: 2
        },
        {
          name: 'Tres - - - - - 3',
          type: 'radio',
          label: 'Tres - - - - - 3',
          value: 3
        },
        {
          name: 'Cuatro - - - - - 4',
          type: 'radio',
          label: 'Cuatro - - - - - 4',
          value: 4
        },
        {
          name: 'Mas de 4',
          type: 'radio',
          label: 'Mas de 4',
          value: '+4'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (cantidad) => {
            let cliente = this.authService.getUsuario()

            this.reservasService.entrarListaEspera(cliente['id'], cliente['nombre'], cantidad);

          }
        }
      ]
    });

      await alert.present();
  }

  public EscannerQR() {
    this.barcodeScanner.scan().then(resultado => {
      let qrValido = false;
      let mesaOcupada = false;

      if (resultado.text == 'entrar al local') {
        let esta_en_espera = false;
        this.listaEspera.forEach(espera => {
          if (espera.cliente == this.usuario['id']) {
            /*
              Poner aca lo de las encuestas
            */
            esta_en_espera = true;
            return;
          }
        });
        if (!esta_en_espera) {
          this.presentAlertRadio().then();
        }

        return;
      }

      this.mesas.forEach(async mesa => {
        if (resultado.text === mesa.qr) {
          qrValido = true;

          if (mesa.estado !== 'disponible' && mesa.estado !== 'reservada') {
            this.mesasClientes.map(mesaCliente => {
              if (mesaCliente.idMesa === mesa.id && mesaCliente.cerrada === false) {
                if (mesaCliente.idCliente !== this.usuario.id) {
                  alert('Esta mesa se encuentra ocupada');
                  mesaOcupada = true;
                }
              }
            });
          }

          if (mesaOcupada === false) {
            switch (mesa.estado) {
              case 'disponible':
                if (confirm('La mesa se encuentra disponible! Desea solicitar esta mesa?')) {
                  mesa.estado = 'realizando pedido';
                  await this.mesasService.updateMesa(mesa).catch(error => {
                    alert(error);
                  });

                  await this.mesasService.asignarMesa({
                    cerrada: false,
                    idCliente: this.usuario.id,
                    idMesa: mesa.id,
                    idMozo: '',
                    juegoBebida: false,
                    juegoDescuento: false,
                    juegoPostre: false,
                    propina: 0
                  });

                  this.reservasService.EliminarDeListaEsperaByIdCliente(this.usuario.id, this.listaEspera);
                }

                break;
              case 'reservada':
                // Falta verificar si hay una reserva en los próximos 40 minutos de esta mesa
                // Si hay reserva, verificar si está a nombre del usuario que scanea el código
                alert('Esta mesa se encuentra reservada');
                break;
              case 'realizando pedido':
                // Verificar si el que escanea el QR tiene la mesa asignada o no
                alert('Ya puede realizar su pedido!');
                break;
              case 'esperando pedido':
                // Verificar si el que escanea el QR tiene la mesa asignada o no
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
                // Verificar si el que escanea el QR tiene la mesa asignada o no
                if (confirm('Espero que esté disfrutando su pedido. Desea dejarnos comentarios acerca de su experiencia?')) {
                  // Mostrar encuesta
                }

                break;
              case 'esperando cuenta':
                // Verificar si el que escanea el QR tiene la mesa asignada o no
                if (confirm('Espero que haya disfrutado de su pedido. Desea dejarnos comentarios acerca de su experiencia?')) {
                  // Mostrar encuesta
                }

                break;
            }
          }
        }
      });

      if (!qrValido) {
        alert(resultado.text);
      }
    });
  }

  public RealizarPedido() {
    this.route.navigate(['/hacer-pedido']);
  }

  public ConfirmarRecepcion() { }

  public PedirCuenta() { }

  public RealizarReserva() { 
    this.route.navigate(['/solicitar-reserva']);
  }

  public Jugar() { }
}

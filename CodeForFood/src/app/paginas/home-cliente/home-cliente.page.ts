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
  private pedidos = [];
  private mesasClientes = [];

  constructor(private platform: Platform, private barcodeScanner: BarcodeScanner, private reservasService: ReservasService,
    private mesasService: MesasService, private pedidosService: PedidosService, private authService: AuthService, private route:Router,
    public alertController: AlertController) {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    this.mesasService.getMesas().subscribe(mesas => { this.mesas = mesas; });
    this.mesasService.getMesasClientes().subscribe(mesasClientes => { this.mesasClientes = mesasClientes; });
    this.reservasService.getReservas().subscribe(reservas => { this.reservas = reservas; });
    this.reservasService.getListaEspera().subscribe(listaEspera => { this.listaEspera = listaEspera; });
    this.pedidosService.getPedidos().subscribe( (data) => {
      this.pedidos = data;
    });
    this.mesasService.getMesasClientes().subscribe( (data) => {
      this.mesasClientes = data;
    });
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

          if (mesa.estado !== 'disponible') {
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
                let mesaDisponible = true;

                this.reservas.forEach(reserva => {
                  const milisegundosReserva = JSON.parse(JSON.stringify(reserva.fecha)).seconds * 1000;
                  const milisegundosActuales = Date.now();

                  if (reserva.estado === 'confirmada' && reserva.idMesa === mesa.id) {
                    // Si faltan menos de 40 minutos para la reserva o todavía no pasaron 15 de la misma
                    if ((milisegundosReserva - 2400000) <= milisegundosActuales &&
                    (milisegundosReserva + 900000) >= milisegundosActuales) {
                      mesaDisponible = false;

                      if (reserva.idCliente === this.usuario.id) {
                        this.solicitarMesa(mesa, `Bienvenido a su mesa ${this.usuario.nombre} ${this.usuario.apellido}! ` +
                        'Pulse OK para confirmar su llegada');
                      }
                      else {
                        alert('Esta mesa se encuentra reservada');
                      }
                    }
                  }
                });

                if (mesaDisponible) {
                  this.solicitarMesa(mesa, 'La mesa se encuentra disponible! Desea solicitar esta mesa?');
                }

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
                      case 'sconfirmar':
                        alert('Su pedido se encuentra pendiente de confirmación del mozo');
                        break;
                      case 'preparacion':
                        alert('Su pedido se encuentra en preparación');
                        break;
                      case 'terminado':
                        alert('Su pedido ya fue preparado y el mozo está por llevarselo a su mesa');
                        break;
                      case 'entregadosconfirmar':
                        alert('Su pedido ya fue entregado y necesita su confirmación');
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
        }
      });

      if (!qrValido) {
        alert(resultado.text);
      }
    });
  }

  private async solicitarMesa(mesa, mensaje: string) {
    if (confirm(mensaje)) {
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
  }

  public RealizarPedido() {
    this.route.navigate(['/hacer-pedido']);
  }

 public ConfirmarRecepcion() {
    this.mesasClientes.forEach(mesacl => {
      if (mesacl.idCliente === this.usuario.id) {
        this.pedidos.forEach(pedido => {
          if (pedido.id_mesa_cliente === mesacl.id) {
            pedido.estado = 'entregado';
            this.pedidosService.updatePedido(pedido.id, pedido);
            this.mesas.forEach(mesa => {
              if (mesa.id === mesacl.idMesa) {
                mesa.estado = 'comiendo';
                this.mesasService.updateMesa(mesa).then();
                alert('confirmado');
              }
            });
          }
        });
      }
    });
  }

  public PedirCuenta() {
    this.mesasClientes.forEach(mesa => {
      if (mesa.idCliente === this.usuario.id) {
        this.mesas.forEach(m => {
          if (m.id === mesa.idMesa) {
            m.estado = 'esperando cuenta';
            this.mesasService.updateMesa(m);
          }
        });
      }
    });
    this.route.navigate(['/cuenta']);
  }

  public RealizarReserva() { 
    this.route.navigate(['/solicitar-reserva']);
  }

  public Jugar() { }
}
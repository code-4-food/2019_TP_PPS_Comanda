import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MesasService } from './../../servicios/mesas.service';
import { Mesa } from './../../interfaces/mesa';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage {
  public desactivado: boolean;
  public mesas: Mesa[];

  constructor(private platform: Platform, private barcodeScanner: BarcodeScanner, private mesasService: MesasService) {
    this.desactivado = true;
    this.mesasService.getMesas().subscribe(mesas => {
      this.mesas = mesas;
    });
  }

  public EscannerQR() {
    this.barcodeScanner.scan().then(resultado => {
      let qrValido = false;

      this.mesas.forEach(mesa => {
        if (resultado.text === mesa.qr) {
          qrValido = true;
          alert('Mesa válida: ' + resultado.text);

          // Si la mesa está disponible, le pregunta si desea tomar
          if (mesa.estado === 'disponible') {
            if (confirm('La mesa se encuentra disponible! Desea tomar esta mesa?')) {
              // Asignar mesa
              alert('Mesa asignada, tome asiento');
            }
          }
        }
      });

      if (!qrValido) {
        alert('Código QR inválido!');
      }
    });
  }

  public RealizarPedido() { }

  public ConfirmarRecepcion() { }

  public PedirCuenta() { }

  public RealizarReserva() { }

  public Jugar() { }
}

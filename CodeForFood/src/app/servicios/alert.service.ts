import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReservasService } from './reservas.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private reservaService:ReservasService, private authService:AuthService) { }

  async mensaje(titulo, mensaje) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      translucent: true,
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }

  async clienteListaEspera() {
    const alert = await this.alertController.create({
      header: 'Bienvenido',
      message: 'Desea agregarse a la lista de espera?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            data=''
            this.reservaService.entrarListaEspera(data);
          }
        }
      ]
    });
    await alert.present();
  }
}

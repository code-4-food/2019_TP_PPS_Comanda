import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReservasService } from './reservas.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private reservaService:ReservasService) { }

  async mensaje(titulo, mensaje){
    const alert = await this.alertController.create({
      header: titulo,
      message:mensaje,
      translucent:true,
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();

  }

  async clienteListaEspera(){
    const alert = await this.alertController.create({
      header: 'Cuantas personas son?',
      inputs:[
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
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.reservaService.entrarListaEspera(data)
          }
        }
      ]
    });
    await alert.present();

  }





}

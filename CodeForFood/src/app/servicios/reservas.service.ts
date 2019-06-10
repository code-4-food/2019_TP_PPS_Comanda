import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Reserva, Espera } from '../interfaces/reserva';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private db: AngularFirestore) { }

  getReservas() {
    return this.db.collection('reservas').snapshotChanges().pipe(map(reservas => {
      return reservas.map(reserva => {
        const data = reserva.payload.doc.data() as Reserva;
        data.id = reserva.payload.doc.id;
        return data;
      });
    }));
  }

  entrarListaEspera(id, nombre, cantidad) {
    const fecha = new Date();
    const anio = fecha.getFullYear().toString();
    const mes = fecha.getMonth().toString();
    const dia = fecha.getDate().toString();
    const hora = fecha.getHours().toString();
    const minuto = fecha.getMinutes().toString();

    this.db.collection('lista-espera').add({
      nombre: nombre,
      ingreso: anio + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto,
      cliente: id,
      cantidad: cantidad
    }).then(ret => { console.log(ret); }).catch(err => { console.log(err); });
  }

  getListaEspera() {
    return this.db.collection('lista-espera').snapshotChanges().pipe(map(esperas => {
      return esperas.map(espera => {
        const data = espera.payload.doc.data() as Espera;
        data.id = espera.payload.doc.id;
        return data;
      });
    }));
  }

  EliminarListaEspera(id) {
    this.db.doc('lista-espera/' + id).delete().then(ret => { console.log(ret); });
  }

  EliminarDeListaEsperaByIdCliente(idCliente: string, listaEspera: Espera[]) {
    listaEspera.map(espera => {
      if (espera.cliente === idCliente) {
        this.db.doc('lista-espera/' + espera.id).delete();
      }
    });
  }
}

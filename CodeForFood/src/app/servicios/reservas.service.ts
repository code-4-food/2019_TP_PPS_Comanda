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

  entrarListaEspera(uid, nombre, cantidad){
    let fecha = new Date();
    let anio = fecha.getFullYear().toString();
    let mes = fecha.getMonth().toString()
    let dia = fecha.getDate().toString()
    let hora = fecha.getHours().toString()
    let minuto = fecha.getMinutes().toString()

    this.db.collection('lista-espera').add({
      nombre: nombre,
      ingreso: anio+'-'+mes+'-'+dia+' '+hora+':'+minuto,
      cliente: uid,
      cantidad: cantidad
    }).then(ret=>{console.log(ret)}).catch(err=>{console.log(err)})
  }

  getListaEspera(){
    return this.db.collection('lista-espera').snapshotChanges().pipe(map(esperas => {
      return esperas.map(espera => {
        const data = espera.payload.doc.data() as Espera;
        data.id = espera.payload.doc.id;
        return data;
      });
    }));
  }

  EliminarListaEspera(id){
    this.db.doc('lista-espera/'+id).delete().then(ret=>{console.log(ret)});
  }


}

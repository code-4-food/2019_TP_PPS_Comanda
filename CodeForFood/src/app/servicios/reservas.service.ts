import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Reserva } from '../interfaces/reserva';
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
}

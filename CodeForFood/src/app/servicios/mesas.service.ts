import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mesa } from './../interfaces/mesa';
<<<<<<< HEAD
import { map } from 'rxjs/operators';
=======
import { map } from 'rxjs/internal/operators/map';
>>>>>>> staging

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  constructor(private db: AngularFirestore) { }

  addMesa(mesa: Mesa) {
    this.db.collection('mesas').add(mesa).then(() => {
      alert('Mesa cargada exitosamente!');
    }).catch(error => {
      alert(error);
    });
  }
<<<<<<< HEAD

  getMesas() {
    return this.db.collection('mesas').snapshotChanges().pipe(map(mesas => {
      return mesas.map(mesa => {
        const data = mesa.payload.doc.data() as Mesa;
        data.id = mesa.payload.doc.id;
=======
  public getMesas() {
    return this.db.collection('mesas').snapshotChanges().pipe(map((fotos) => {
      return fotos.map((a) => {
        const data = a.payload.doc.data() as Mesa;
        data['id'] = a.payload.doc.id;
>>>>>>> staging
        return data;
      });
    }));
  }
}

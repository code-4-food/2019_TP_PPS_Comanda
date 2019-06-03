import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mesa } from './../interfaces/mesa';

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
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mesa } from './../interfaces/mesa';
import { map } from 'rxjs/internal/operators/map';

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
  public getMesas() {
    return this.db.collection('mesas').snapshotChanges().pipe(map((fotos) => {
      return fotos.map((a) => {
        const data = a.payload.doc.data() as Mesa;
        data['id'] = a.payload.doc.id;
        return data;
      });
    }));
  }
}

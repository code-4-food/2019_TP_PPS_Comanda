import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { EncuestaCliente } from '../interfaces/encuesta';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  constructor(private db: AngularFirestore) { }

  addEncuesta(encuesta: EncuestaCliente) {
    return new Promise((resolve, rejected) => {
      this.db.collection('encuestas-cliente').add(encuesta).then(ret => {
        resolve(ret);
      }).catch(err => {
        rejected(err);
      });
    });
  }
}

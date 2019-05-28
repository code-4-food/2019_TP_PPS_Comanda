import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

export interface objetoMesa {
  numero: number;
  espacios: number;
  tipo: string;
  qr: string;
  foto: string;
  ocupada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  constructor(private db: AngularFirestore, private fireStorage: AngularFireStorage) { }

  addMesa(mesa: objetoMesa) {
    this.db.collection('mesas').add(mesa).then(() => {
      alert('Mesa cargada exitosamente!');
    }).catch(error => {
      alert(error);
    });
  }

  async uploadFotoToFirebase(dataFoto: string) {
    const picName = (new Date()).getTime().toString();
    const respuesta = await this.fireStorage.storage.ref(picName).putString(dataFoto, 'base64', { contentType: 'image/jpeg' }).
    then((uploadFoto) => {
      return uploadFoto.ref.getDownloadURL().then(downloadLink => {
        return downloadLink.toString();
      });
    });

    return respuesta;
  }
}

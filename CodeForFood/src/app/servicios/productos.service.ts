import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
  ) { }

  CrearProducto(producto) {
    return new Promise((resolve, rejected) => {
      this.firestore.collection('productos').add(producto).then(ret => {
        resolve(ret)
      }).catch(err => {
        rejected(err)
      })
    });
  }

  getProductos(){
    return new Promise((resolve, rejected) => {
      this.firestore.collection('productos').snapshotChanges().toPromise().then(ret => {
        resolve(ret)
      }).catch(err => {
        rejected(err)
      })
    });
  }
}

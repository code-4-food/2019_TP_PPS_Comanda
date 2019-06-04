import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { Pedido } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private firestore: AngularFirestore) { }

  public getPedidos() {
    return this.firestore.collection('pedidos').snapshotChanges().pipe(map((fotos) => {
      return fotos.map((a) => {
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      });
    }));
  }
  public getPedidosProductos() {
    return this.firestore.collection('pedido-productos').snapshotChanges().pipe(map((fotos) => {
      return fotos.map((a) => {
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      });
    }));
  }
  public getProductos() {
    return this.firestore.collection('productos').snapshotChanges().pipe(map((fotos) => {
      return fotos.map((a) => {
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      });
    }));
  }
  public PagarPedido(pedido: Pedido) {
    return this.firestore.collection('pedidos').ref.where('id', '==', pedido['id']).get().then(async (documento) => {
      this.firestore.collection('pedidos').doc(pedido['id']).set({
          comienzo: pedido.comienzo,
          'id-mesa-cliente': pedido['id-mesa-cliente'],
          'id-mozo': pedido['id-mozo'],
          estado: 'pagado'
      })
      .catch(err => {
        console.log('Error al pagar', err);
      });
    });
  }
}

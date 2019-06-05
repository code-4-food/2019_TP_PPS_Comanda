import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { Pedido, PedidoProducto } from '../interfaces/pedido';
import { ProductosService } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private firestore: AngularFirestore,
    private productosService:ProductosService
  ) { }


  getPedidos() {
    return this.firestore.collection('pedidos').snapshotChanges().pipe(map((pedidos) => {
      return pedidos.map((pedido) => {
        const data = pedido.payload.doc.data() as Pedido;
        data.id = pedido.payload.doc.id;
        return data;
      });
    }));
  }

  getPedidoProductos() {
    return this.firestore.collection('pedido-productos').snapshotChanges().pipe(map((pedidos) => {
      return pedidos.map((pedido) => {
        const data = pedido.payload.doc.data() as PedidoProducto;
        data.id = pedido.payload.doc.id;
        return data;
      });
    }));
  }

  updatePedido(id, pedido){
    this.firestore.doc('pedidos/'+id).update(pedido)

  }

  updatePedidoProducto(id, pedido){
    this.firestore.doc('pedido-productos/'+id).update(pedido)
  }

}

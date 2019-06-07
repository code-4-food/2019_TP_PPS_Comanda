import { MesaCliente } from './../interfaces/mesa-cliente';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mesa } from './../interfaces/mesa';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  constructor(private db: AngularFirestore) { }

  updateMesa(mesa: Mesa) {
    return this.db.collection('mesas').doc(mesa.qr).set(mesa);
  }

  getMesas() {
    return this.db.collection('mesas').snapshotChanges().pipe(map(mesas => {
      return mesas.map(mesa => {
        const data = mesa.payload.doc.data() as Mesa;
        data.id = mesa.payload.doc.id;
        return data;
      });
    }));
  }

  asignarMesa(mesaCliente: MesaCliente) {
    this.db.collection('mesa-cliente').add(mesaCliente).then(() => {
      alert('Mesa asignada, tome asiento');
    }).catch(error => {
      alert(error);
    });
  }

  entrarListaEspera(uid, nombre){
    let fecha = new Date();
    let anio = fecha.getFullYear().toString();
    let mes = fecha.getMonth().toString()
    let dia = fecha.getDate().toString()
    let hora = fecha.getHours().toString()
    let minuto = fecha.getMinutes().toString()

    this.db.collection('lista-espera').add({
      nombre: nombre,
      ingreso: anio+'-'+mes+'-'+dia+'-'+hora+'-'+minuto,
      cliente: uid
    }).then(ret=>{console.log(ret)}).catch(err=>{console.log(err)})
  }
}

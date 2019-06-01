import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { resolve, reject } from 'q';
import { Anonimo, Empleado, Cliente } from '../interfaces/usuario';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario:any = false;
  constructor(
    private AFauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    ) { }

  LogIn(mail, pass) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(mail, pass).then(usuarioLogeado => {
        // let usuarioData = this.TransformarUsuario(usuarioLogeado.user.uid)
        let uid = usuarioLogeado.user.uid;
        this.GetUsuarios().then(usrs => {
          usrs.forEach(element => {
            let obj_element = element.data();
            if (obj_element.activo && obj_element.uid == uid) {
              switch (obj_element.perfil) {
                case 'bar':
                case 'cocina':
                case 'supervisor':
                case 'mozo':
                case 'metre':
                case 'delivery':
                case 'dueño':
                  this.usuario = obj_element as Empleado;
                  localStorage.setItem('usuario', JSON.stringify(this.usuario))
                  resolve(this.usuario)
                  break;
                case 'cliente':
                  this.usuario = obj_element as Cliente;
                  localStorage.setItem('usuario', JSON.stringify(this.usuario))
                  resolve(this.usuario)
                  break;
                case 'anonimo':
                  this.usuario = obj_element as Anonimo;
                  localStorage.setItem('usuario', JSON.stringify(this.usuario))
                  resolve(this.usuario)
                  break;
              }
            }
          });
          if(this.usuario){
            resolve(this.usuario)
          }
          else{
            this.LogOut();
            rejected(this.usuario)
          }

        });
      }).catch(err => {
        this.LogOut();
        rejected(err)});
    });
  }

  LogOut() {
    localStorage.removeItem("usuario")
    this.AFauth.auth.signOut();
  }

  private GetUsuarios() {
    this.AFauth.auth.currentUser
    return this.firestore.collection('usuarios').get().toPromise();
  }

  CrearAuth(mail, pass, usuario, foto) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.createUserWithEmailAndPassword(mail, pass).then(nuevousuario => {
        // let usuarioData = this.TransformarUsuario(usuarioLogeado.user.uid)
        usuario.uid = nuevousuario.user.uid;
        this.CrearUsuario(usuario, foto).then(ret => {
          this.LogOut()
          resolve(usuario);
        }).catch(err => {
          this.LogOut();
          rejected(err)
        })
      }).catch(err => rejected(err));
    });
  }

  getUid(){
    return this.getUsuario().uid;
  }

  getUsuario(){
    return JSON.parse(localStorage.getItem('usuario'));
  }

  private CrearUsuario(usuarios, foto) {
    return new Promise((resolve, rejected) => {
      this.fireStorage.storage.ref(this.getUid()).putString(foto, 'base64', { contentType: 'image/jpeg' }).then(
       async () =>{
        await this.fireStorage.ref(this.getUid()).getDownloadURL().subscribe(downloadLink => {
          usuarios.foto = downloadLink;
          this.firestore.collection('usuarios').add(usuarios).then(ret => {
            resolve(ret)
          }).catch(err => {
            rejected(err)
          })
        });
       }
      )
    })

  }



}

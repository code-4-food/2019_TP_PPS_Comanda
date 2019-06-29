import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  email;
  password;
  constructor(
    private publicRouter:Router,
    private auth:AuthService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {

  }

  OnSubmitLogIn(){
    console.log(this.email)
    console.log(this.password)
    this.auth.LogIn(this.email, this.password).then(res => {
      console.log(res)
      if(this.auth.getUsuario()['perfil'] != 'cliente'){
        this.publicRouter.navigate(['encuesta-empleado'])
      }
      else{
        this.publicRouter.navigate(['/home'])
      }
    }).catch(err =>{
      // alert(err)
      console.log(err)
    });
  }


  Rellenar(usr, password){
    this.email=usr;
    this.password = password;
  }

  Registrarse(){
    this.publicRouter.navigate(['alta-cliente'])
  }

  loginAnonimo() {
    localStorage.setItem('usuario', JSON.stringify({
      "foto":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/245px-Anonymous_emblem.svg.png",
      "nombre":"Anonymous",
      "perfil":"anonimo",
      "uid":"QzCxmkSwajRVfyGgIe8M4WrohOu2",
      "id":"anonimoNoBorrar"}));

    this.publicRouter.navigate(['/home-cliente']);
  }
}

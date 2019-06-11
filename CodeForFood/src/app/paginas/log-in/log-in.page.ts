import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastController } from '@ionic/angular';

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
      this.publicRouter.navigate(['/home'])
    }).catch(err =>{
      alert(err)
      console.log(err)
    });
  }


  Rellenar(usr, password){
    this.email=usr;
    this.password = password;
  }
}

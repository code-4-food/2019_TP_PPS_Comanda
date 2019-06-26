import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/servicios/chat.service';
import { Chat } from 'src/app/interfaces/chat';
import { AuthService } from 'src/app/servicios/auth.service';
import { MesasService } from 'src/app/servicios/mesas.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  mensajes = [];
  msj='';
  usuario;
  constructor(private chat:ChatService, private auth:AuthService) { }

  ngOnInit() {
    this.usuario = this.auth.getUsuario()
    this.chat.GetChat().subscribe(mensajes=>{
      this.mensajes = mensajes;
      this.ordenarMensajes()
    })

  }

  ordenarMensajes(){
    console.log(this.mensajes.sort(compare))
  }

  sendMessage(){
    let msj={};
    msj['mensaje'] = this.msj;
    if(this.usuario['perfil'] == 'delivery'){
      msj['nombre']='DELIVERY: '+this.usuario['nombre']

    }
    else{
      msj['nombre']=this.usuario['apellido']+'  '+this.usuario['nombre']
    }
    const fecha = new Date();
    const anio = fecha.getFullYear().toString();
    const mes = fecha.getMonth().toString();
    const dia = fecha.getDate().toString();
    const hora = fecha.getHours().toString();
    const minuto = fecha.getMinutes().toString();
    const seg = fecha.getSeconds().toString();
    msj['fecha'] = anio+' '+mes+' '+dia +' '+ hora+':'+ minuto+':'+ seg
    msj['usuario'] = this.usuario['id']
    this.chat.SendMensaje(msj)
    this.msj = ''
  }
}


function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const genreA = a.fecha.toUpperCase();
  const genreB = b.fecha.toUpperCase();

  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}
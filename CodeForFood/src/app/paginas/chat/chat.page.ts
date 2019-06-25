import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  mensajes = [
    {
      mensaje:'hola como estansdahghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh1?',
      lado:'end',
      nombre:'Marcos Rey',
      fecha:'19/06/24 18:54'
    },
    {
      mensaje:'hola como estan2?',
      lado:'end',
      nombre:'Marcos Rey',
      fecha:'18/06/24 18:54'
    },
    {
      mensaje:'hola como estan3?',
      lado:'start',
      nombre:'Marcos Rey',
      fecha:'19/05/24 18:54'
    },
    {
      mensaje:'hola como estan4?',
      lado:'end',
      nombre:'Marcos Rey',
      fecha:'19/06/24 18:53'
    },
  ]
  constructor() { }

  ngOnInit() {
    this.ordenarMensajes()
  }

  ordenarMensajes(){
    console.log(this.mensajes.sort(compare))
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
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-comanda',
  templateUrl: './home-comanda.page.html',
  styleUrls: ['./home-comanda.page.scss'],
})
export class HomeComandaPage implements OnInit {

  constructor(
    private route: Router,    
  ) { }

  ngOnInit(

  ) {
  }

  Mover(lugar){
    this.route.navigate([lugar])
  }

}

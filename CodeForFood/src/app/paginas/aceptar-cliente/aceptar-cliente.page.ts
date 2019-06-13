import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Cliente } from 'src/app/interfaces/usuario';
import { EmailComposer, EmailComposerOptions } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-aceptar-cliente',
  templateUrl: './aceptar-cliente.page.html',
  styleUrls: ['./aceptar-cliente.page.scss'],
})
export class AceptarClientePage implements OnInit {
  clientes = [];
  constructor( private clienteServe:AuthService,private emailComposer: EmailComposer) { }

  ngOnInit() {
    this.clienteServe.GetUsuarios().then(clientes=>{
      this.clientes = [];
      clientes.forEach(cliente=>{
        let obj_element = cliente.data() as Cliente;
        obj_element.id = cliente.id;
        if(!obj_element.activo){
          this.clientes.push(obj_element)
        }
        
      })
    })
  }

  AceptarCliente(cliente){
    cliente.activo = true;
    this.clienteServe.ModificarUsuario(cliente);
    this.SendEmail(cliente);

  }

  SendEmail(cliente:Cliente) {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send

      }
    });
    let email:EmailComposerOptions = {
      to: cliente.mail,
      cc: '',
      bcc: [],
      attachments: [
      ],
      subject: 'Code for Food: Tu cuenta ha sido validada',
      body: 'Por favor entra a nuestra aplicacion para poder acceder a tu cuenta',
      isHtml: true
    }

    // Send a text message using default options
    this.emailComposer.open(email).then(ret => { console.log(ret) }).catch(err => { alert(err); console.log(err) });

  }
}

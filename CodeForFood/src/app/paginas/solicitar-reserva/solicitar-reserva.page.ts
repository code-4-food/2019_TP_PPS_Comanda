import { Cliente } from './../../interfaces/usuario';
import { Component } from '@angular/core';
import { Mesa } from 'src/app/interfaces/mesa';
import { MesasService } from 'src/app/servicios/mesas.service';
import { Reserva } from 'src/app/interfaces/reserva';
import { ReservasService } from 'src/app/servicios/reservas.service';

@Component({
  selector: 'app-solicitar-reserva',
  templateUrl: './solicitar-reserva.page.html',
  styleUrls: ['./solicitar-reserva.page.scss'],
})
export class SolicitarReservaPage {
  public reservas: Reserva[];
  public misReservas: Reserva[];
  public mesas: Mesa[];
  public mesaSeleccionada: Mesa;
  public fechaReserva: string;
  public horaReserva: string;
  public usuario: Cliente;

  constructor(private mesasService: MesasService, private reservasService: ReservasService) {
    this.mesasService.getMesas().subscribe(mesas => { this.mesas = mesas; });
    this.reservasService.getReservas().subscribe(reservas => { this.reservas = reservas; });
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }

  solicitarReserva() {
    if (this.fechaReserva === undefined || this.horaReserva === undefined || this.mesaSeleccionada === undefined) {
      alert('Debe completar todos los campos!');
      return;
    }

    const milisegundosReservaDeseada = new Date(this.fechaReserva + ' ' + this.horaReserva).getTime();
    let reservaValida = true;

    if (milisegundosReservaDeseada < (Date.now() + 3600000)) {
      alert('Las reservas se pueden solicitar hasta 1 hora antes del horario a reservar');
      return;
    }

    this.reservas.forEach(reserva => {
      const milisegundosReservaYaConfirmada = JSON.parse(JSON.stringify(reserva.fecha)).seconds * 1000;

      if (reserva.estado === 'confirmada' && reserva.idMesa === this.mesaSeleccionada.id) {
        // Si la reserva que está solicitando se encuentra en el rango de los 40 minutos previos o posteriores de la reserva ya confirmada
        if ((milisegundosReservaYaConfirmada - 2400000) <= milisegundosReservaDeseada &&
        (milisegundosReservaYaConfirmada + 2400000) >= milisegundosReservaDeseada) {
          alert('La mesa ya se encuentra reservada para ese día y horario');
          reservaValida = false;
        }
      }
    });

    if (reservaValida) {
      this.reservasService.addReserva({
        id: '',
        idMesa: this.mesaSeleccionada.id,
        idCliente: this.usuario.id,
        fecha: new Date(this.fechaReserva + ' ' + this.horaReserva),
        estado: 'pendiente',
      }).then(() => {
        alert('Reserva solicitada');
      }).catch(error => {
        alert(error);
      });
    }
  }
}

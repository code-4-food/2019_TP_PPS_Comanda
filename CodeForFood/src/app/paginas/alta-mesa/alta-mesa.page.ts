import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MesasService } from './../../servicios/mesas.service';
import { FirestorageService } from './../../servicios/firestorage.service';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
})
export class AltaMesaPage {
  public numeroMesa: number;
  public cantidadComensales: number;
  public tipoMesa: string;
  public codigoQrMesa: string;
  public urlFotoMesa: string;

  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera,
  private mesasService: MesasService, private firestorageService: FirestorageService) {
    this.numeroMesa = null;
    this.cantidadComensales = null;
    this.tipoMesa = '';
    this.codigoQrMesa = '';
    this.urlFotoMesa = '';
  }

  public asociarCodigoQR() {
    this.barcodeScanner.scan().then(resultado => {
      this.codigoQrMesa = resultado.text;
    });
  }

  public tomarFotoMesa() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 500,
      targetHeight: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.firestorageService.uploadFotoToFirebase(imageData).then(imageURL => {
        this.urlFotoMesa = imageURL;
      });
    });
  }

  public cargarMesa() {
    if (this.numeroMesa === null ||
      this.cantidadComensales === null ||
      this.tipoMesa === '' ||
      this.codigoQrMesa === '' ||
      this.urlFotoMesa === '') {
      alert('Debe completar todos los datos para poder cargar una mesa');
      return;
    }

    this.mesasService.addMesa({
      numero: this.numeroMesa,
      espacios: this.cantidadComensales,
      tipo: this.tipoMesa,
      qr: this.codigoQrMesa,
      foto: this.urlFotoMesa,
      ocupada: false
    });
  }
}

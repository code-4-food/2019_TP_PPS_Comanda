import { AuthService } from './../../servicios/auth.service';
import { FirestorageService } from './../../servicios/firestorage.service';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage {
  public nombreUsuario: string;
  public apellidoUsuario: string;
  public dniUsuario: string;
  public correoUsuario: string;
  public claveUsuario: string;
  public dataFotoUsuario: string;
  public urlFotoUsuario: string;
  public nacionalidadUsuario: string;
  public nacimientoUsuario: string;
  public tipoRegistro: string;
  public dataDNI: string[];

  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera,
  private authService: AuthService, private firestorageService: FirestorageService) {
    this.nombreUsuario = '';
    this.apellidoUsuario = '';
    this.dniUsuario = '';
    this.correoUsuario = '';
    this.claveUsuario = '';
    this.dataFotoUsuario = '';
    this.urlFotoUsuario = '';
    this.nacionalidadUsuario = '';
    this.nacimientoUsuario = '';
    this.tipoRegistro = 'Nuevo usuario';
  }

  public tomarDatosDNI() {
    this.barcodeScanner.scan().then(resultado => {
      this.dataDNI = resultado.text.split('@');

      if (this.dataDNI.length >= 7) {
        this.dniUsuario = this.dataDNI[0];
        this.apellidoUsuario = this.dataDNI[3];
        this.nombreUsuario = this.dataDNI[4];
        this.nacionalidadUsuario = this.dataDNI[5];
        this.nacimientoUsuario = this.dataDNI[6];
      }
    });
  }

  public tomarFotoUsuario() {
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
      this.dataFotoUsuario = imageData;
      this.firestorageService.uploadFotoToFirebase(imageData).then(imageURL => {
        this.urlFotoUsuario = imageURL;
      });
    });
  }

  public cargarUsuario() {
    if ((this.tipoRegistro === 'Anónimo' && (this.nombreUsuario === '' || this.urlFotoUsuario === '')) ||
    this.tipoRegistro === 'Nuevo usuario' && (this.nombreUsuario === '' || this.apellidoUsuario === '' ||
    this.dniUsuario === '' || this.correoUsuario === '' || this.claveUsuario === '' || this.urlFotoUsuario === '')) {
      alert('Debe completar todos los campos');
      return;
    }

    if (this.tipoRegistro === 'Nuevo usuario' && this.claveUsuario.length < 6) {
      alert('La clave debe tener al menos 6 caracteres');
      return;
    }

    let emailRegex;
    emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (this.tipoRegistro === 'Nuevo usuario' && !emailRegex.test(this.correoUsuario)) {
      alert('Debe ingresar un e-mail válido');
      return;
    }

    if (this.tipoRegistro === 'Nuevo usuario') {
      this.authService.CrearAuth(this.correoUsuario, this.claveUsuario, {
        uid: '',
        foto: this.urlFotoUsuario,
        nombre: this.nombreUsuario,
        apellido: this.apellidoUsuario,
        mail: this.correoUsuario,
        dni: this.dniUsuario,
        genero: '',
        nacimiento: '',
        nacionalidad: '',
        activo: false,
        perfil: 'cliente'
      }, this.dataFotoUsuario).then(() => {
        alert('Usuario registrado exitosamente!');
      }).catch(error => {
        alert('ERROR: ' + error);
      });
    }
    else {
      this.authService.CrearUsuario({
        foto: this.urlFotoUsuario,
        nombre: this.nombreUsuario,
        perfil: 'anonimo'
      }, this.dataFotoUsuario, this.nombreUsuario).then(usuario => {
        alert('Usuario anónimo registrado exitosamente!');
        this.authService.setAnonimoInLocalStorage(usuario);
        alert(localStorage.getItem('usuario'));
      }).catch(error => {
        alert('ERROR: ' + error);
      });
    }
  }
}

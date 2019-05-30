import { Component, OnInit } from '@angular/core';
import { CameraOptions } from '@ionic-native/camera';
import { Camera } from '@ionic-native/camera/ngx';
import { FirestorageService } from 'src/app/servicios/firestorage.service';
import { ErrorService } from 'src/app/servicios/error.service';
import { Empleado } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {
  public faltan: boolean;
  public empleado: Empleado = {
    uid: '',
    nombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    mail: '',
    perfil: '',
    foto: '',
    activo: true
  };
  public password = '';
  public emailmal: boolean;

  constructor(private camera: Camera, private fotosService: FirestorageService,
    private errorHand: ErrorService, private authService: AuthService,
    private router: Router, private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
  }

  Ingresar() {
    this.faltan = false;
    this.emailmal = false;
    console.log(this.empleado);
    if (this.empleado.nombre !== '' && this.empleado.apellido !== '' &&
    this.empleado.dni !== '' && this.empleado.cuil !== '' && this.empleado.perfil !== ''
    && this.empleado.mail !== '' && this.password !== '') {
      const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (emailRegex.test(this.empleado.mail)) {
        const camOptions: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: true,
          correctOrientation: true,
        };
        this.camera.getPicture(camOptions).then(async (pictureAux) => {
          this.fotosService.uploadFotoToFirebase(pictureAux).then(imageURL => {
            this.empleado.foto = imageURL;
            this.authService.CrearAuth(this.empleado.mail, this.password, this.empleado, imageURL).then( () => {
              this.errorHand.MostrarErrorSoloLower('Agregado!');
              this.router.navigate(['/home']);
            });
          });
        }, error => {
          if (error === 'No Image Selected') {
            this.errorHand.MostrarErrorSoloLower('No se sacó imágen');
          } else {
            this.errorHand.MostrarErrorSoloLower('Error al sacar foto ' + error);
          }
          console.log(error);
        }).catch(err => {
          console.log(err);
        });
      } else {
        this.emailmal = true;
      }
    } else {
      this.faltan = true;
    }
  }
  LeerQR() {
    this.barcodeScanner.scan().then(barcodeData => {
      try {
        const datos = barcodeData.text.split('@');
        this.empleado.cuil = datos[0];
        this.empleado.apellido = datos[1];
        this.empleado.nombre = datos[2];
        this.empleado.dni = datos[4];
      } catch (err) {
        this.errorHand.MostrarErrorSoloLower('Error: ' + err);
      }
     }).catch(err => {
        this.errorHand.MostrarErrorSoloLower('Error: ' + err);
        console.log('Error', err);
     });
  }
}

export interface Cliente {
    uid:string;
    foto:string;
    nombre:string;
    apellido:string;
    mail:string;
    dni:string;
    genero:string;
    nacimiento:string;
    nacionalidad:string;
    activo:boolean;
    perfil:string;
}

export interface Empleado {
    uid:string;
    foto:string;
    nombre:string;
    apellido:string;
    mail:string;
    dni:string;
    genero:string;
    nacimiento:string;
    nacionalidad:string;
    cuil:string;
    activo:boolean;
    perfil:string;
}

export interface Anonimo {
    uid:string;
    foto:string;
    nombre:string;
    mail:string;
    activo:boolean;
    perfil:string;
}

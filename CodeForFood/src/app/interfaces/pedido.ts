export interface Pedido {

    id:string;
    id_mesa_cliente:string;
    id_mozo:string;
    estado:string;
    comienzo: string;
}

export interface PedidoProducto {
    id:string;
    id_pedido:string;
    id_producto:any;
    estado:string;
    id_comanda:string;
}

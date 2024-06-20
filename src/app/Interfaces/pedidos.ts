import { DetallePedidos } from "./detalle-pedidos";

export interface Pedidos {
    idpedido:number,
    idcliente:number,
    descripcionClientes:string,
    name:string,
    fechaCreacion?:string,
    dateOrder?:string,
    statusCreatePurchaseOrder:boolean, 
    createUid:boolean,
    userId:string,
    origenVenta:string,
    amountTotal:string,
    estado:string,
    nxtSync:string,
    stateErp:string,
    feria:string,
    amountUntaxed:string,
    linesCountInteger:number,
    detallepedidos:DetallePedidos[]
}



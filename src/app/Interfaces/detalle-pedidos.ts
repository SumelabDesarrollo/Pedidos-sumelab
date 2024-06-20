export interface DetallePedidos {
    iddetallepedido:number,
    idpedido:number,
    descripcionProductos:string,
    //descripcionClientes:string,
    incentivo:string,
    slProductPvf:string,
    slProductPvp:string,
    qtyOrder:number,

    qtyBonus:number,

    discount:string,

    productUomQty:string,

    slVirtualAvailable:string,

    priceUnit:string,

    amountTax:string,

    slSubtotal:string,

    amountTotal:string,

    iva:number,
    final:string,
    idProducto:number


}
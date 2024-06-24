import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ProductosService } from '../../../../Services/productos.service';
import { PedidosService } from '../../../../Services/pedidos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ClientesService } from '../../../../Services/clientes.service';

import { Productos } from '../../../../Interfaces/productos';
import { Pedidos } from '../../../../Interfaces/pedidos';
import { DetallePedidos } from '../../../../Interfaces/detalle-pedidos';
import { Clientes } from '../../../../Interfaces/clientes';
import { ModalPedidoComponent } from '../../Modales/modal-pedido/modal-pedido.component';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-pedidos',
    templateUrl: './pedidos.component.html',
    styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

    listaProductos: Productos[] = [];
    listaClientes: Clientes[] = [];
    listaProductosFiltro: Productos[] = [];
    listaClientesFiltro: Clientes[] = [];
    listaProductosParaPedidos: DetallePedidos[] = [];
    bloquearBotonRegistrar: boolean = false;
    productoSeleccionado!: Productos;
    clienteSeleccionado: Clientes | null = null;
    totalPagar: number = 0;
    amountTotalModal: number = 0;
    interes: string ='';
    total: number =0;
    formularioProductoPedidos: FormGroup;
    columnasTabla: string[] = ['Producto','Incentivo', 'PVF', 'PVP', 'CantidadOrdenada', 'CantidadBonificada', 'PorcentajeDescuento', 'Cantidad', 'Stock', 'PrecioUnitario', 'slVirtualAvailable','Subtotal', 'Acciones'];
    datosDetallePedidos = new MatTableDataSource(this.listaProductosParaPedidos);

    constructor(
        private _productosService: ProductosService,
        private _pedidosService: PedidosService,
        private _utilidadService: UtilidadService,
        private _clientesService: ClientesService,
        private fb: FormBuilder,
        public dialog: MatDialog
    ) {
        this.formularioProductoPedidos = this.fb.group({
            Producto: ['', Validators.required],
            Cantidad: ['', Validators.required],
            Cliente: ['', Validators.required],
            //RUC: [this.clienteSeleccionado.vat, Validators.required],
        });

        this._productosService.lista().subscribe({
            next: (data) => {
                if (data.status) {
                    const lista = data.value as Productos[];
                    this.listaProductos = lista.filter(p => parseInt(p.stock, 10) > 0);
                }
            },
            error: (e) => { console.error('Error al obtener la lista de productos', e); }
        });

        this._clientesService.lista().subscribe({
            next: (data) => {
                if (data.status) {
                    this.listaClientes = data.value as Clientes[];
                    this.listaClientesFiltro = [...this.listaClientes];
                }
            },
            error: (e) => { console.error('Error al obtener la lista de clientes', e); }
        });

        this.formularioProductoPedidos.get('Producto')?.valueChanges.subscribe(value => {
            this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
        });

        this.formularioProductoPedidos.get('Cliente')?.valueChanges.subscribe(value => {
            this.listaClientesFiltro = this.retornarClientesPorFiltro(value);
        });

    }

    retornarProductosPorFiltro(busqueda: any): Productos[] {
        // Verificar si busqueda es null o undefined
        if (busqueda == null) {
            console.warn('El parámetro busqueda es null o undefined');
            return [];
        }
    
        let valorBuscado: string;
    
        if (typeof busqueda === 'string') {
            valorBuscado = busqueda.toLocaleLowerCase();
        } else if (busqueda.name) {
            valorBuscado = busqueda.name.toLocaleLowerCase();
        } else {
            console.warn('El objeto busqueda no tiene la propiedad name');
            return [];
        }
    
        return this.listaProductos.filter(item =>
            item.name.toLocaleLowerCase().includes(valorBuscado)
        );
    }
    
    retornarClientesPorFiltro(busqueda: any): Clientes[] {
        const valorBuscado = typeof busqueda === 'string' ? busqueda.toLocaleLowerCase() : '';
        return this.listaClientes.filter(item =>
            item && item.name && item.name.toLocaleLowerCase().includes(valorBuscado)
        );
    }

    ngOnInit(): void {
        // Lógica de inicialización aquí
    }

    mostrarProductos(producto: Productos): string {
        return producto ? producto.name : '';
    }

    mostrarClientes(cliente: any): string {
        return cliente && cliente.name ? cliente.name : '';
    }
    

    productosParaPedido(event: any) {
        this.productoSeleccionado = event.option.value;
        //this.formularioProductoPedidos.patchValue({ Producto: this.productoSeleccionado.displayName });
    }

    clientesParaPedido(event: any) {
        this.clienteSeleccionado = event.option.value;
    }

    agregarProductosParaPedidos() {
        if (!this.productoSeleccionado) {
            return;
        }
    
        if (!this.formularioProductoPedidos.valid) {
            Swal.fire('Error', 'Debe llenar todos los campos del formulario', 'error');
            return;
        }
    
        const _cantidad: number = this.formularioProductoPedidos.value.Cantidad;
        const _precio: number = parseFloat(String(this.productoSeleccionado.slProductPvp).replace(',', '.')); // Convertir a número
    
        if (!isNaN(_precio)) { // Verificar si es un número válido
            const _total: number = _cantidad * _precio;
            this.totalPagar += _total;
    
            this.listaProductosParaPedidos.push({
                iddetallepedido: 0,
                idpedido: 0,
                idProducto: this.productoSeleccionado.idProducto,
                descripcionProductos: this.productoSeleccionado.name,
                incentivo: '10',
                slProductPvf: '10',
                slProductPvp: String(_precio),
                qtyOrder: _cantidad, // Utilizar la cantidad seleccionada del formulario del modal
                qtyBonus: 10,
                discount: '10',
                productUomQty: String(_cantidad), // Utilizar la cantidad seleccionada del formulario del modal
                slVirtualAvailable: String(this.productoSeleccionado.stock),
                priceUnit: _precio.toFixed(0),
                amountTax: '10',
                slSubtotal: String(_total),
                amountTotal: '0',
                iva: 0,
                final: ''
            });
    
            this.datosDetallePedidos = new MatTableDataSource(this.listaProductosParaPedidos);
        } else {
            console.error('El precio del producto no es un número válido');
        }
    
        // Resetear solo los campos de Producto y Cantidad
        this.formularioProductoPedidos.patchValue({
            Producto: '',
            Cantidad: ''
        });
    
        this.productoSeleccionado = undefined!;
    }
    

    eliminarProducto(detalle: DetallePedidos) {
        this.totalPagar -= parseFloat(detalle.amountTotal);
        this.listaProductosParaPedidos = this.listaProductosParaPedidos.filter(p => p.idProducto != detalle.idProducto);
        this.datosDetallePedidos = new MatTableDataSource(this.listaProductosParaPedidos);
    }


    

    getTotal(): number {
        return this.listaProductosParaPedidos.map(t => parseFloat(t.slSubtotal)).reduce((acc, value) => acc + value, 0);
    }
    getSubtotal(): number {
        return this.listaProductosParaPedidos.reduce((acc, item) => acc + parseFloat(item.slSubtotal), 0);
    }

    getTotalTax(): number {
        return this.listaProductosParaPedidos.reduce((acc, item) => acc + parseFloat(item.slSubtotal), 0);
    }

    getTotalAmount(): number {
        return this.listaProductosParaPedidos.reduce((acc, item) => acc + parseFloat(item.slSubtotal), 0);
    }
    

    abrirModalPedido(): void {
        const dialogRef = this.dialog.open(ModalPedidoComponent, {
            width: '500px',
            data: { productos: this.listaProductosFiltro } // Pasar la lista de productos al modal
        });
    
        dialogRef.afterClosed().subscribe((data: { productoSeleccionado: Productos | undefined, cantidad: number }) => {
            if (data && data.productoSeleccionado) {
                const productoSeleccionado = data.productoSeleccionado;
                const cantidad = data.cantidad;
    
                const precioString = String(productoSeleccionado.slProductPvp); // Convertir a cadena de caracteres
                const precio = parseFloat(precioString);
                if (!isNaN(precio)) { // Verificar si es un número válido
                    const totalProducto = precio * cantidad;
                    this.totalPagar += totalProducto;
    
                    const _precioList = parseFloat(String(productoSeleccionado.listPrice).replace(',', '.')); // Convertir a número
                    const _precioPvp = parseFloat(String(productoSeleccionado.slProductPvp).replace(',', '.')); // Convertir a número
                    const subtotal = _precioPvp * cantidad;
    
                    this.listaProductosParaPedidos.push({
                        iddetallepedido: 0,
                        idpedido: 0,
                        idProducto: productoSeleccionado.idProducto,
                        descripcionProductos: productoSeleccionado.name,
                        incentivo: '10',
                        slProductPvf: String(_precioList), // Asignar listPrice a slProductPvf
                        slProductPvp: String(_precioPvp), // Asignar slProductPvp a slProductPvp
                        qtyOrder: cantidad, // Utilizar la cantidad seleccionada del formulario del modal
                        qtyBonus: 10,
                        discount: '10',
                        productUomQty: String(cantidad), // Utilizar la cantidad seleccionada del formulario del modal
                        slVirtualAvailable: String(productoSeleccionado.stock),
                        priceUnit: _precioPvp.toFixed(2).toString(), // Convertir a cadena de caracteres con dos decimales
                        amountTax: String(productoSeleccionado.taxesId),
                        slSubtotal: subtotal.toFixed(2), // Guardar el subtotal con dos decimales
                        amountTotal: subtotal.toFixed(2),
                        iva: 0,
                        final: '10'
                    });
                    
                    this.datosDetallePedidos = new MatTableDataSource(this.listaProductosParaPedidos);

                    this.amountTotalModal = subtotal;
                    this.interes= productoSeleccionado.taxesId;

                } else {
                    console.error('El precio del producto no es un número válido');
                }
            }
        });
    }
    

    registrarPedidos() {
        if (this.listaProductosParaPedidos.length > 0 && this.clienteSeleccionado) {
            this.bloquearBotonRegistrar = true;
    
            // Obtener la fecha actual
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1; // Los meses van de 0 a 11, por lo que sumamos 1
            const year = today.getFullYear();
            const formattedDay = (day < 10 ? '0' : '') + day;
            const formattedMonth = (month < 10 ? '0' : '') + month;
            const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
            const _total = this.getTotalAmount();
    
            const amountTotalFormatted = _total.toFixed(2).replace(',', '.');
    
            const request: Pedidos = {
                idcliente: this.clienteSeleccionado.idcliente,
                descripcionClientes: this.clienteSeleccionado.name,
                name: 'Nuevo Pedido',
                fechaCreacion: formattedDate,
                dateOrder: formattedDate,
                statusCreatePurchaseOrder: true,
                userId: this.clienteSeleccionado.userId,
                origenVenta: 'Call center',
                amountTotal: amountTotalFormatted,
                nxtSync: 'sincronización',
                stateErp: 'activo',
                feria: 'feria2',
                amountUntaxed: this.interes,
                linesCountInteger: 2,
                createUid: false,
                estado: 'Presupuesto',
                detallepedidos: this.listaProductosParaPedidos,
                idpedido: 0,
            };
    
            console.log('Registrando pedido:', request);
    
            this._pedidosService.registrar(request).subscribe({
                next: (response) => {
                    console.log('Respuesta del servidor:', response);
                    if (response.status) {
                        this.totalPagar = 0.00;
                        this.listaProductosParaPedidos = [];
                        this.datosDetallePedidos = new MatTableDataSource(this.listaProductosParaPedidos);
                        this.formularioProductoPedidos.reset();
                        this.clienteSeleccionado = null;
    
                        Swal.fire({
                            icon: 'success',
                            title: 'Pedido Registrado'
                        });
                    } else {
                        this._utilidadService.mostrarAlerta('No se pudo registrar el pedido', 'Error');
                    }
                },
                error: (e) => {
                    console.error('Error al registrar el pedido', e);
                }
            });
    
            this.bloquearBotonRegistrar = false;
        } else {
            this._utilidadService.mostrarAlerta('Debe agregar productos y seleccionar un cliente', 'Error');
        }
    }
    
    confirmarPedidos() {
        if (this.listaProductosParaPedidos.length > 0 && this.clienteSeleccionado) {
            this.bloquearBotonRegistrar = true;
    
            // Verificar las condiciones adicionales del cliente
            if (
                this.clienteSeleccionado.estado !== 'ACTIVO' ||
                this.clienteSeleccionado.maximodias >= 5 ||
                parseFloat(this.clienteSeleccionado.saldo.toString()) >= parseFloat(this.clienteSeleccionado.creditLimit)
            ) {
                // Mostrar mensaje de error y no confirmar el pedido
                this._utilidadService.mostrarAlerta('El cliente no cumple con los requisitos para confirmar el pedido.', 'Error');
                this.bloquearBotonRegistrar = false;
                return;
            }
    
            // Obtener la fecha actual
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1; // Los meses van de 0 a 11, por lo que sumamos 1
            const year = today.getFullYear();
            const formattedDay = (day < 10 ? '0' : '') + day;
            const formattedMonth = (month < 10 ? '0' : '') + month;
            const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
    
            const _total = this.getTotalAmount();
            const amountTotalFormatted = _total.toFixed(2).replace(',', '.');
    
            const request: Pedidos = {
                idcliente: this.clienteSeleccionado.idcliente,
                descripcionClientes: this.clienteSeleccionado.name,
                name: 'Nuevo Pedido',
                fechaCreacion: formattedDate,
                dateOrder: formattedDate,
                statusCreatePurchaseOrder: true,
                userId: this.clienteSeleccionado.userId,
                origenVenta: 'Call center',
                amountTotal: amountTotalFormatted,
                nxtSync: 'sincronización',
                stateErp: 'activo',
                feria: 'feria2',
                amountUntaxed: this.interes,
                linesCountInteger: 2,
                createUid: false,
                estado: 'Pedido de venta', // Cambiado a "Pedido de venta"
                detallepedidos: this.listaProductosParaPedidos,
                idpedido: 0,
            };
    
            console.log('Confirmando pedido:', request);
    
            this._pedidosService.registrar(request).subscribe({
                next: (response) => {
                    if (response.status) {
                        this.totalPagar = 0.00;
                        this.listaProductosParaPedidos = [];
                        this.datosDetallePedidos = new MatTableDataSource(this.listaProductosParaPedidos);
                        this.formularioProductoPedidos.reset();
                        this.clienteSeleccionado = null;
    
                        Swal.fire({
                            icon: 'success',
                            title: 'Pedido Confirmado'
                        });
                    } else {
                        this._utilidadService.mostrarAlerta('No se pudo confirmar el pedido', 'Error');
                    }
                },
                error: (e) => {
                    console.error('Error al confirmar el pedido', e);
                },
                complete: () => {
                    this.bloquearBotonRegistrar = false;
                }
            });
    
        } else {
            this._utilidadService.mostrarAlerta('Debe agregar productos y seleccionar un cliente', 'Error');
        }
    }
    
    



    
    
    


}
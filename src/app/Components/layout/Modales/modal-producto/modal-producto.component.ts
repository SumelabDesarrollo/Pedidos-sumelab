import { Component,OnInit,Inject } from '@angular/core';

import { FormBuilder, FormGroup,Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productos } from '../../../../Interfaces/productos';
import { ProductosService } from '../../../../Services/productos.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css'
})
export class ModalProductoComponent implements OnInit{
  formularioProductos:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";


  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProductos:Productos,
    private fb: FormBuilder,
    private _productoServicio:ProductosService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioProductos = this.fb.group({
      nxtIdErp: ['',Validators.required],
      name:['',Validators.required],
      listPrice:['',Validators.required],
      slProductPvp:['',Validators.required],
      stock:['',Validators.required],
      taxesId:['',Validators.required],
      estado:['',Validators.required],
      slMarca:['',Validators.required],
      grupo:['',Validators.required],
      presentacion:['',Validators.required],
      fraccionador:['',Validators.required]
    });
    if(this.datosProductos != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  
  }

  ngOnInit(): void {
    if(this.datosProductos != null){
      this.formularioProductos.patchValue({

        nxtIdErp: this.datosProductos.nxtIdErp,
        name:this.datosProductos.name,
        listPrice:this.datosProductos.listPrice,
        slProductPvp:this.datosProductos.slProductPvp,
        stock:this.datosProductos.stock,
        taxesId:this.datosProductos.taxesId,
        estado:this.datosProductos.estado,
        slMarca:this.datosProductos.slMarca,
        grupo:this.datosProductos.grupo,
        presentacion:this.datosProductos.presentacion,
        fraccionador:this.datosProductos.fraccionador

        
      });
    }

    
  }


  guardarEditar_Productos(){
    const _productos:Productos={
      idProducto: this.datosProductos == null ? 0 : this.datosProductos.idProducto,
      name: this.formularioProductos.value.name,
      listPrice: this.formularioProductos.value.listPrice,
      slProductPvp: this.formularioProductos.value.slProductPvp,
      stock: this.formularioProductos.value.stock,
      taxesId: this.formularioProductos.value.taxesId,
      estado: false,
      slMarca: this.formularioProductos.value.sl_marca,
      nxtIdErp: '',
      grupo: '',
      presentacion: "",
      fraccionador: "",
      supplierDifareCode: ''
    }

    if(this.datosProductos == null){

      this._productoServicio.guardar(_productos).subscribe({
        next:(data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue registrado","Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto","Error")
        },
        error:(e) =>{}
      })
    }else{

      this._productoServicio.editar(_productos).subscribe({
        next:(data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue editado","Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo editar el producto","Error")
        },
        error:(e) =>{}
      })
    }
  }

}

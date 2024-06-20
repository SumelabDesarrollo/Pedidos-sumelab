import { Component,OnInit,Inject } from '@angular/core';

import { FormBuilder, FormGroup,Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clientes } from '../../../../Interfaces/clientes';
import { ClientesService } from '../../../../Services/clientes.service';

import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.component.html',
  styleUrl: './modal-clientes.component.css'
})
export class ModalClientesComponent implements OnInit{
  formularioClientes:FormGroup;
  constructor(
    private modalActual: MatDialogRef<ModalClientesComponent>,
    @Inject(MAT_DIALOG_DATA) public datosClientes:Clientes,
    private fb: FormBuilder,
    private _clienteServicio:ClientesService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioClientes = this.fb.group({
      Idcliente: ['',Validators.required],
      Name:['',Validators.required],
      vat:['',Validators.required],
      XStudioNombreComercialSap:['',Validators.required],
      PropertyPaymentTermId:['',Validators.required],
      Email:['',Validators.required],
      CreditLimit:['',Validators.required],
      UserId:['',Validators.required],
      AsesorCredito:['',Validators.required],
      AsesorCallcenter:['',Validators.required],
      slActiveSap:['',Validators.required],
      StateId:['',Validators.required],
      Observacion:['',Validators.required]
      

    });
  
  }
  ngOnInit(): void {
    if(this.datosClientes != null){
      this.formularioClientes.patchValue({

        Idcliente: this.datosClientes.idcliente,
        Vat:this.datosClientes.vat,
        Name:this.datosClientes.name,
        XStudioNombreComercialSap:this.datosClientes.xStudioNombreComercialSap,
        SlClaCli:this.datosClientes.slClaCli,
        PropertyPaymentTermId:this.datosClientes.propertyPaymentTermId,
        Email:this.datosClientes.email,
        CreditLimit:this.datosClientes.creditLimit,
        UserId:this.datosClientes.userId,
        AsesorCredito:this.datosClientes.asesorCredito,
        AsesorCallcenter:this.datosClientes.asesorCallcenter,
        slActiveSap:this.datosClientes.slActiveSap,
        StateId:this.datosClientes.stateId,
        Observacion:this.datosClientes.observacion

      });
    }
    
  }
}

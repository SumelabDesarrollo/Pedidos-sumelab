import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarPedidoComponent } from './modal-editar-pedido.component';

describe('ModalEditarPedidoComponent', () => {
  let component: ModalEditarPedidoComponent;
  let fixture: ComponentFixture<ModalEditarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditarPedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

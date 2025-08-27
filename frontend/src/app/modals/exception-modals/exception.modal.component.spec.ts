import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionModalComponent } from './exception.modal.component';

describe('ExceptionModalComponent', () => {
  let component: ExceptionModalComponent;
  let fixture: ComponentFixture<ExceptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExceptionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExceptionComponent } from './my.exception.component';

describe('MyExceptionComponent', () => {
  let component: MyExceptionComponent;
  let fixture: ComponentFixture<MyExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyExceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

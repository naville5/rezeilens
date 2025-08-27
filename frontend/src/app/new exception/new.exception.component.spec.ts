import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExceptionComponent } from './new.exception.component';

describe('NewExceptionComponent', () => {
  let component: NewExceptionComponent;
  let fixture: ComponentFixture<NewExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewExceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

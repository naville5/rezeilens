import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsReportsComponent } from './report.component';

describe('DepartmentMasterComponent', () => {
  let component: TransactionsReportsComponent;
  let fixture: ComponentFixture<TransactionsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

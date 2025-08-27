import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPolicyModalComponent } from './view-policy-modal.component';

describe('ViewPolicyModalComponent', () => {
  let component: ViewPolicyModalComponent;
  let fixture: ComponentFixture<ViewPolicyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPolicyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

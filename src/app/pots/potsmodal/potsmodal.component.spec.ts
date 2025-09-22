import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotsmodalComponent } from './potsmodal.component';

describe('PotsmodalComponent', () => {
  let component: PotsmodalComponent;
  let fixture: ComponentFixture<PotsmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotsmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotsmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

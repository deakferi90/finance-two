import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsComponent } from './budgets.component';
import { provideToastr, Toast } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetsComponent', () => {
  let component: BudgetsComponent;
  let fixture: ComponentFixture<BudgetsComponent>;

  const toastrServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning'),
    info: jasmine.createSpy('info'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsComponent, Toast, HttpClientTestingModule],
      providers: [provideToastr(), { useValue: toastrServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

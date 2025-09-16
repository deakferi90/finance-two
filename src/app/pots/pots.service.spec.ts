import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PotsComponent } from './pots.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PotsComponent', () => {
  let component: PotsComponent;
  let fixture: ComponentFixture<PotsComponent>;

  const toastrServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning'),
    info: jasmine.createSpy('info'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotsComponent, HttpClientTestingModule],
      providers: [{ provide: ToastrService, useValue: toastrServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

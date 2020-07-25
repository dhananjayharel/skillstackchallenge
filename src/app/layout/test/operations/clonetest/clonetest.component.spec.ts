import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClonetestComponent } from './clonetest.component';

describe('ClonetestComponent', () => {
  let component: ClonetestComponent;
  let fixture: ComponentFixture<ClonetestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClonetestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClonetestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

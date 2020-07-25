import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterpagecontentComponent } from './centerpagecontent.component';

describe('CenterpagecontentComponent', () => {
  let component: CenterpagecontentComponent;
  let fixture: ComponentFixture<CenterpagecontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterpagecontentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterpagecontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AggregatPage } from './aggregat.page';

describe('AggregatPage', () => {
  let component: AggregatPage;
  let fixture: ComponentFixture<AggregatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AggregatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

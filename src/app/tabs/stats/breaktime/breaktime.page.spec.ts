import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BreaktimePage } from './breaktime.page';

describe('BreaktimePage', () => {
  let component: BreaktimePage;
  let fixture: ComponentFixture<BreaktimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreaktimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BreaktimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

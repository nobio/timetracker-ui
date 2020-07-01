import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FailsPage } from './fails.page';

describe('FailsPage', () => {
  let component: FailsPage;
  let fixture: ComponentFixture<FailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

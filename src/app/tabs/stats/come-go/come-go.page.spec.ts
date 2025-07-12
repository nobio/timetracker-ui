import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComeGoPage } from './come-go.page';

describe('ComeGoPage', () => {
  let component: ComeGoPage;
  let fixture: ComponentFixture<ComeGoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComeGoPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComeGoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

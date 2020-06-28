import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EntriesPage } from './entries.page';

describe('HomePage', () => {
  let component: EntriesPage;
  let fixture: ComponentFixture<EntriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntriesPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EntriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

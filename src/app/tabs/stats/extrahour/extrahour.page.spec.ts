import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtrahourPage } from './extrahour.page';

describe('ExtrahourPage', () => {
  let component: ExtrahourPage;
  let fixture: ComponentFixture<ExtrahourPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExtrahourPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCollectionPage } from './new-collection.page';

describe('NewCollectionPage', () => {
  let component: NewCollectionPage;
  let fixture: ComponentFixture<NewCollectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

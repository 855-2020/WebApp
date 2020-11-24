/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimplifiedModelComponent } from './simplified-model.component';

describe('SimplifiedModelComponent', () => {
  let component: SimplifiedModelComponent;
  let fixture: ComponentFixture<SimplifiedModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplifiedModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplifiedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

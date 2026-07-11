import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grid } from './grid';

@Component({
  selector: 'app-grid-test-host',
  imports: [Grid],
  template: `<app-grid><p>projected content</p></app-grid>`,
})
class TestHost {}

describe('Grid', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
  });

  it('projects content inside the grid container', async () => {
    await fixture.whenStable();

    const projected = fixture.nativeElement.querySelector('.grid p');
    expect(projected?.textContent).toBe('projected content');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';


describe('Home', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, HomeComponent],
    });

    fixture = TestBed.createComponent(HomeComponent);

    // query for the link (<a> tag) by CSS element selector
    de = fixture.debugElement.query(By.css('.home-card'));
    el = de.nativeElement;
  });

  it('It has the basic home page text', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain("This is a home page! It doesn't do anything!");
  });
});

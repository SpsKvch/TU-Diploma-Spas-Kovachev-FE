import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateJournalComponent } from './template-journal.component';

describe('TemplateJournalComponent', () => {
  let component: TemplateJournalComponent;
  let fixture: ComponentFixture<TemplateJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateJournalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

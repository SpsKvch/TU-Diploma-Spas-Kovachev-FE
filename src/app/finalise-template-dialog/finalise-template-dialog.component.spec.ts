import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaliseTemplateDialogComponent } from './finalise-template-dialog.component';

describe('FinaliseTemplateDialogComponent', () => {
  let component: FinaliseTemplateDialogComponent;
  let fixture: ComponentFixture<FinaliseTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinaliseTemplateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinaliseTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

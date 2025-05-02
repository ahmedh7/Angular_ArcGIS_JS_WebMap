import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsSidebarComponent } from './statistics-sidebar.component';

describe('StatisticsSidebarComponent', () => {
  let component: StatisticsSidebarComponent;
  let fixture: ComponentFixture<StatisticsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

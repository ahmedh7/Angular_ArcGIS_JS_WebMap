import { Component, ViewChild } from '@angular/core';
import { MapViewComponent } from './map-view/map-view.component'
import { FilterSidebarComponent } from "./filter-sidebar/filter-sidebar.component";
import { StatisticsSidebarComponent } from "./statistics-sidebar/statistics-sidebar.component";
import { HeaderComponent } from "./header/header.component";
import { PrintService } from './utilities/print.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapViewComponent, FilterSidebarComponent, StatisticsSidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AbuDhabi_Munic_Task';

  constructor(private printService: PrintService){}

  @ViewChild(StatisticsSidebarComponent) statsComponent!: StatisticsSidebarComponent;

  printRequested(){
    this.printService.captureAndCombine( this.statsComponent);
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../map.service';

@Component({  
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements OnInit{
  constructor(private mapService: MapService){}
  
  ngOnInit(): void {
    this.mapService.initializeMap("mapViewDiv");
  }
}

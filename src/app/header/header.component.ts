import { Component, EventEmitter, Output } from '@angular/core';
import { ZipExportService } from '../utilities/zip.service';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { MapService } from '../map.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private zipService: ZipExportService, private mapService: MapService) {}

  @Output() printRequest = new EventEmitter<void>();

  downloadAll() {
    if (!this.mapService.admin0Layer || !this.mapService.admin1Layer || !this.mapService.admin2Layer){
      alert("Please wait for initialize");
      return;
    }
    const layers: [string, FeatureLayer][] = [
      ["admin0", this.mapService.admin0Layer],
      ["admin1", this.mapService.admin1Layer],
      ["admin2", this.mapService.admin2Layer]
    ];
    this.zipService.exportLayersAsZip(layers, "admin-layers.zip");
  }

  onPrintRequest(){
    this.printRequest.emit();
  }
}



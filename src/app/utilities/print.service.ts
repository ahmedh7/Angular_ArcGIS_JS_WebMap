// print.service.ts
import { Injectable} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MapService } from '../map.service';

@Injectable({ providedIn: 'root' })
export class PrintService {
  
  constructor(private mapService: MapService){}
  
  async captureAndCombine(statsComponent:any) {
    const sidebarElement = statsComponent.getSidebarElement();
  
    // Capture the map using ArcGIS API's takeScreenshot
    if (!this.mapService.mapView)
    {return;}
  
  
    // Capture the sidebar using html2canvas
    const sidebarCanvas = await html2canvas(sidebarElement);
    const sidebarImage = new Image();
    sidebarImage.src = sidebarCanvas.toDataURL();
    await sidebarImage.decode();
      
    const screenshot = await this.mapService.mapView.takeScreenshot();
    const mapImage = new Image();
    mapImage.src = screenshot.dataUrl;
    await mapImage.decode();

    // Create a canvas to combine both images
    const combinedCanvas = document.createElement('canvas');
    const ctx = combinedCanvas.getContext('2d')!;
    combinedCanvas.width = mapImage.width + sidebarImage.width;
    combinedCanvas.height = Math.min(mapImage.height, sidebarImage.height);
  
    ctx.drawImage(mapImage, 0, 0);
    ctx.drawImage(sidebarImage, mapImage.width, -15);
  
    // Convert the combined canvas to an image
    const finalImage = combinedCanvas.toDataURL('image/png');
  
    // export to PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [combinedCanvas.width, combinedCanvas.height]
    });
    pdf.addImage(finalImage, 'PNG', 0, 0, combinedCanvas.width, combinedCanvas.height);
    pdf.save('map_with_statistics.pdf');
  }
}

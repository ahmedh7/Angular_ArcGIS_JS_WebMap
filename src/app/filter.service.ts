import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { AdminType } from './shared/adminType';
import { SelectedStatistics, TotalStatistics } from './shared/statisticsInterface';
import { BehaviorSubject } from 'rxjs';
import { SelectedCodes } from './shared/selectedCodesInterface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private _totalStatistics$ = new BehaviorSubject<TotalStatistics>({
    allAdmin0Count: 0,
    allAdmin1Count: 0,
    allAdmin2Count: 0,
  });
  public totalStatistics$ = this._totalStatistics$.asObservable();

  private _selectedStatistics$ = new BehaviorSubject<SelectedStatistics>({
    selectedAdmin0Count: 0,
    selectedAdmin1Count: 0,
    selectedAdmin2Count: 0,
  });
  public selectedStatistics$ = this._selectedStatistics$.asObservable();

  private _selectedCodes$ = new BehaviorSubject<SelectedCodes>({
    selectedAdmin0Codes: [],
    selectedAdmin1Codes: [],
    selectedAdmin2Codes: [],
  });
  public selectedCodes$ = this._selectedCodes$.asObservable();

  constructor(private mapService: MapService) { }

  getFilteredAdmin1(selectedAdmin0Codes: string[], allAdmin1: AdminType[]): AdminType[] {
    return allAdmin1.filter(admin1 => selectedAdmin0Codes.includes(admin1.parentId));
  }

  getFilteredAdmin2(selectedAdmin1Codes: string[], allAdmin2: AdminType[]): AdminType[] {
    return allAdmin2.filter(admin2 => selectedAdmin1Codes.includes(admin2.parentId));
  }

  filterLayers(selectedAdmin0: string[], selectedAdmin1: string[], selectedAdmin2: string[]){
    const selectedAdmin0Codes = selectedAdmin0.map((code)=> `'${code}'`);
    const selectedAdmin1Codes = selectedAdmin1.map((code)=> `'${code}'`);
    const selectedAdmin2Codes = selectedAdmin2.map((code)=> `'${code}'`);

    if (selectedAdmin0Codes.length === 0){
      console.log("admin0 = 0");
      if (this.mapService.admin0Layer)
        this.mapService.admin0Layer.definitionExpression = '1=0';
      
      if (this.mapService.admin1Layer)
        this.mapService.admin1Layer.definitionExpression = '1=0';

      if (this.mapService.admin2Layer)
        this.mapService.admin2Layer.definitionExpression = '1=0';

      return;
    }
    
    if (selectedAdmin1Codes.length === 0){
      console.log("admin1 = 0");

      if (this.mapService.admin0Layer)
        this.mapService.admin0Layer.definitionExpression = `adm0_ISO3 IN (${selectedAdmin0Codes.join(",")})`;

      if (this.mapService.admin1Layer)
        this.mapService.admin1Layer.definitionExpression = '1=0';

      if (this.mapService.admin2Layer)
        this.mapService.admin2Layer.definitionExpression = '1=0';
      
      return;
    }

    if (selectedAdmin2Codes.length === 0){
      console.log("admin2 = 0");

      if (this.mapService.admin0Layer)
        this.mapService.admin0Layer.definitionExpression = `adm0_ISO3 IN (${selectedAdmin0Codes.join(",")})`;
      
      if (this.mapService.admin1Layer){
        this.mapService.admin1Layer.definitionExpression = `adm1_pcode IN (${selectedAdmin1Codes.join(",")})`;
        this.mapService.admin1Layer.visible = true;
      }

      if (this.mapService.admin2Layer)
        this.mapService.admin2Layer.definitionExpression = '1=0';
      
      return;
    }

    console.log("working...");
    
      if (this.mapService.admin0Layer)
        this.mapService.admin0Layer.definitionExpression = `adm0_ISO3 IN (${selectedAdmin0Codes.join(",")})`;
      
      if (this.mapService.admin1Layer){
        this.mapService.admin1Layer.definitionExpression = `adm1_pcode IN (${selectedAdmin1Codes.join(",")})`;
        this.mapService.admin1Layer.visible = true;
      }

      if (this.mapService.admin2Layer){
        this.mapService.admin2Layer.definitionExpression = `adm2_pcode IN (${selectedAdmin2Codes.join(",")})`;
        this.mapService.admin2Layer.visible = true;
      }
      
      return;
    
  }

  setLayersTotalStats(totalStatistics: TotalStatistics){
    this._totalStatistics$.next(totalStatistics);
  }

  setLayersSelectedStats(selectedStatistics: SelectedStatistics){
    this._selectedStatistics$.next(selectedStatistics);
  }

  setSelectedCodes(selectedCodes: SelectedCodes){
    this._selectedCodes$.next(selectedCodes);
  }
}

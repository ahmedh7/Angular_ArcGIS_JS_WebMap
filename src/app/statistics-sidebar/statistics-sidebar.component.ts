import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilterService } from '../filter.service';
import { MapService } from '../map.service';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import { SelectedCodes } from '../shared/selectedCodesInterface';
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator";
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import Query from "@arcgis/core/rest/support/Query";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { SelectedStatistics, TotalStatistics } from '../shared/statisticsInterface';

@Component({
  selector: 'app-statistics-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './statistics-sidebar.component.html',
  styleUrl: './statistics-sidebar.component.css'
})
export class StatisticsSidebarComponent implements OnInit{
  public totlasStatistics: TotalStatistics | null = null;
  public selectedStatistics: SelectedStatistics | null = null;
  public selectedCodes: SelectedCodes | null = null;

  constructor(private filterService: FilterService, private mapService: MapService){}

  @ViewChild('sidebar', { static: true }) sidebarRef!: ElementRef;

  getSidebarElement(): HTMLElement {
    return this.sidebarRef.nativeElement;
  }
  

  ngOnInit(): void {
    this.filterService.totalStatistics$.subscribe((totlasStatistics)=>{
      this.totlasStatistics = totlasStatistics;
    });
    this.filterService.selectedStatistics$.subscribe((selectedStats)=>{
      this.selectedStatistics = selectedStats;
    });
    this.filterService.selectedCodes$.subscribe((selectedCodes)=>{
      this.selectedCodes = selectedCodes;
    });
  }

  async exportToCSV(layerNum: string){
    let layerToUse: FeatureLayer | null = null;
    let field: string = '';
    console.log('detectingLayer');

    switch (layerNum){
      case 'admin0':
        layerToUse = this.mapService.admin0Layer;
        field = 'adm0_ISO3';
      break;

      case 'admin1':
        layerToUse = this.mapService.admin1Layer;
        field = 'adm1_pcode';
      break;

      case 'admin2':
        layerToUse = this.mapService.admin2Layer;
        field = 'adm2_pcode';
      break;
    }

    const objectIds: number[] | undefined = await layerToUse?.queryObjectIds();
    console.log(objectIds);
    if (objectIds?.length === 0){
      alert("Please select features first");
    }
    const featureTable = new FeatureTable({
      layer: layerToUse,
      highlightEnabled: false,
      highlightIds: objectIds
    });
    await featureTable.exportSelectionToCSV();
    console.log('exported')
  }

  async fillToMap(layerNum: string){
    let layerViewToUse: FeatureLayerView | null = null;
    let field: string = '';
    let ids: string[] = [];
    console.log('detectingLayer');

    switch (layerNum){
      case 'admin0':
        layerViewToUse = this.mapService.admin0LayerView;
        field = 'adm0_ISO3';
        ids = this.selectedCodes?.selectedAdmin0Codes || [];
      break;

      case 'admin1':
        layerViewToUse = this.mapService.admin1LayerView;
        field = 'adm1_pcode';
        ids = this.selectedCodes?.selectedAdmin1Codes || [];
      break;

      case 'admin2':
        layerViewToUse = this.mapService.admin2LayerView;
        field = 'adm2_pcode';
        ids = this.selectedCodes?.selectedAdmin2Codes || [];
      break;
    }

    if (!layerViewToUse?.visible){
      alert("Please enable the layer first");
      return;
    }

    ids = ids.map(id => `'${id}'`);
    const query = new Query ({
      outFields: [],
      returnGeometry: true,
      where: `${field} IN (${ids.join(",")})`
    });
    await this.mapService.mapView?.goTo({
      center: [0, 0],
      zoom: 1
    })
    await reactiveUtils.whenOnce(() => !layerViewToUse?.updating);
    setTimeout(async() => {
      const result = await layerViewToUse?.queryFeatures(query);
    if (result?.features.length === 0){
      alert("Please select features first");
    }
    if (result){
      const geomArr = result.features.map((feature)=> feature.geometry).filter((geom): geom is Polygon => geom != null);
      const geomUnion = unionOperator.executeMany(geomArr);
      this.mapService.mapView?.goTo(geomUnion, {
        animate: true,
        duration: 1000
      });
    }
    }, 0);
    
  }

}

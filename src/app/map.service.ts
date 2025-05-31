import { Injectable } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LayerList from "@arcgis/core/widgets/LayerList";
import Legend from "@arcgis/core/widgets/Legend";
import {ADMIN_LAYER_URLS} from './shared/constants'
import Graphic from '@arcgis/core/Graphic';
import { BehaviorSubject } from 'rxjs';
import {AdminType} from './shared/adminType'
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Search from "@arcgis/core/widgets/Search";
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map: Map | null = null;
  public mapView: MapView | null = null;
  public admin0Layer: FeatureLayer| null = null;
  public admin1Layer: FeatureLayer| null = null;
  public admin2Layer: FeatureLayer| null = null;

  public admin0LayerView: FeatureLayerView | null = null;
  public admin1LayerView: FeatureLayerView | null = null;
  public admin2LayerView: FeatureLayerView | null = null;

  private _allAdmin0Status$ = new BehaviorSubject<AdminType[]>([]);
  public allAdmin0Status$ = this._allAdmin0Status$.asObservable();

  private _allAdmin1Status$ = new BehaviorSubject<AdminType[]>([]);
  public allAdmin1Status$ = this._allAdmin1Status$.asObservable();
  
  private _allAdmin2Status$ = new BehaviorSubject<AdminType[]>([]);
  public allAdmin2Status$ = this._allAdmin2Status$.asObservable();
  
  private mapViewElement?: HTMLElement;

  constructor() { }

  setMapViewElement(el: HTMLElement) {
    this.mapViewElement = el;
  }
  async printMap() {
    if (!this.mapViewElement) return;

    await this.mapView?.when();
    const canvas = await html2canvas(this.mapViewElement);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 180); // Adjust size/position as needed
    pdf.save('map.pdf');
  }

  async initializeMap(container: string){
    this.map = new Map({
      basemap: "dark-gray-3d"
    });

    this.mapView = new MapView({
      map: this.map,
      container,
      zoom: 2
    });

    await this.addLayersToMap();
    this.addWidgetsToMap();
    this.setAllAdmin0();
    this.setAllAdmin1();
    this.setAllAdmin2();
  }

  async addLayersToMap(){
    this.admin0Layer = new FeatureLayer({
      url: ADMIN_LAYER_URLS.ADMIN0,
      definitionExpression: "1=0"
    });

    this.admin1Layer = new FeatureLayer({
      url: ADMIN_LAYER_URLS.ADMIN1,
      definitionExpression: "1=0"
    });

    this.admin2Layer = new FeatureLayer({
      url: ADMIN_LAYER_URLS.ADMIN2,
      definitionExpression: "1=0"
    });

    this.map?.addMany([this.admin0Layer, this.admin1Layer, this.admin2Layer]);

    if (this.mapView){
      this.admin0LayerView = await this.mapView?.whenLayerView(this.admin0Layer);
      this.admin1LayerView = await this.mapView?.whenLayerView(this.admin1Layer);
      this.admin2LayerView = await this.mapView?.whenLayerView(this.admin2Layer);
    }else{
      console.error("Faield to create layerViews");
    }
    
  }

  addWidgetsToMap(){
    const legend = new Legend({
      view: this.mapView,
    });
    const legendExpand = new Expand({
      expandIcon: "legend",  // see https://developers.arcgis.com/calcite-design-system/icons/
      view: this.mapView,
      content: legend
    });
    this.mapView?.ui.add(legendExpand, 'bottom-right');

    const layerList = new LayerList({
      view: this.mapView,
      collapsed: true,
      visibleElements: {
        collapseButton: true,
        heading: true,
      }
    });
    const layerListExpand = new Expand({
      expandIcon: "layers",  // see https://developers.arcgis.com/calcite-design-system/icons/
      view: this.mapView,
      content: layerList
    });
    this.mapView?.ui.add(layerListExpand, 'bottom-left');

    const bmGallery = new BasemapGallery({
      view: this.mapView,
    });
    const bmGalleryExpand = new Expand({
      expandIcon: "basemap",  // see https://developers.arcgis.com/calcite-design-system/icons/
      view: this.mapView,
      content: bmGallery
    });
    this.mapView?.ui.add(bmGalleryExpand, "top-right");


    const searchSource = new LayerSearchSource({
        layer: new FeatureLayer({
        url: ADMIN_LAYER_URLS.ADMIN0,
        outFields: ["*"]
        })
      });
    const searchWidget = new Search({
      view: this.mapView,
      sources: 
      [
        searchSource
      ]
    });
    const searchExpand = new Expand({
      expandIcon: "search",
      view: this.mapView,
      content: searchWidget
    });
    this.mapView?.ui.add(searchExpand, "top-right");

  }

  setAllAdmin0() {
    this.admin0Layer?.load().then(() =>
      this.admin0Layer?.queryFeatures({
        where: "1=1",
        outFields: ["adm0_ISO3", "adm0_name"]
      }).then((result) => {
        const allAdmin0 = result.features.map((feature: any) => new AdminType(feature.attributes['adm0_ISO3'], feature.attributes  ['adm0_name'], ''));
        this._allAdmin0Status$.next(allAdmin0);
      }).catch((err) => {
        console.log(err);
      })
    );
  }

  setAllAdmin1() {
    this.admin1Layer?.load().then(() =>
      this.admin1Layer?.queryFeatures({
        where: "1=1",
        outFields: ['adm1_pcode', 'adm1_name', 'adm0_ISO3']
      }).then((result) => {
        const allAdmin1 = result.features.map((feature: any) => new AdminType(feature.attributes['adm1_pcode'], feature.attributes['adm1_name'], feature.attributes['adm0_ISO3']));
        this._allAdmin1Status$.next(allAdmin1);
      }).catch((err) => {
        console.log(err);
      })
    );
  }

  setAllAdmin2() {
    this.admin2Layer?.load().then(() =>
      this.admin2Layer?.queryFeatures({
        where: "1=1",
        outFields: ['adm2_pcode', 'adm2_name', 'adm1_pcode']
      }).then((result) => {
        const allAdmin2 = result.features.map((feature: any) => new AdminType(feature.attributes['adm2_pcode'], feature.attributes['adm2_name'], feature.attributes['adm1_pcode']));
        this._allAdmin2Status$.next(allAdmin2);
      }).catch((err) => {
        console.log(err);
      })
    );
  }
}

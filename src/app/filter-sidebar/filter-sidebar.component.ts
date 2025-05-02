import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { AdminType } from '../shared/adminType';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../filter.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.css'
})
export class FilterSidebarComponent implements OnInit{
  public admin0List: AdminType[] = [];
  public admin1List: AdminType[] = [];
  public admin2List: AdminType[] = [];

  public filteredAdmin0List: AdminType[] = [];
  public filteredAdmin1List: AdminType[] = [];
  public filteredAdmin2List: AdminType[] = [];

  public selectedAdmin0Ids: string[] = [];
  public selectedAdmin1Ids: string[] = [];
  public selectedAdmin2Ids: string[] = [];

  public isAdmin1Visible: boolean = false;
  public isAdmin2Visible: boolean = false;

  constructor(private mapService: MapService, private filterService: FilterService){}

  ngOnInit(): void {
    this.mapService.allAdmin0Status$.subscribe((allAdmin0)=>{
      this.admin0List = allAdmin0;
      this.updateLayersStatistics();
    });
    this.mapService.allAdmin1Status$.subscribe((allAdmin1)=>{
      this.admin1List = allAdmin1;
    });
    this.mapService.allAdmin2Status$.subscribe((allAdmin2)=>{
      this.admin2List = allAdmin2;
    });
  }


  onAdmin0Change(){
    this.filteredAdmin1List = this.filterService.getFilteredAdmin1(this.selectedAdmin0Ids, this.admin1List);
    this.selectedAdmin1Ids = this.selectedAdmin1Ids.filter(admin1Id => this.filteredAdmin1List.some(admin1 => admin1.id === admin1Id));
    if (this.filteredAdmin1List.length === 0){
      this.isAdmin1Visible = false;
      this.selectedAdmin1Ids = [];
      this.filteredAdmin1List = [];

      this.isAdmin2Visible = false;
      this.selectedAdmin2Ids = [];
      this.filteredAdmin2List = [];
    }
    else{
      this.isAdmin1Visible = true;

      this.filteredAdmin2List = this.filterService.getFilteredAdmin2(this.selectedAdmin1Ids, this.admin2List);
      this.selectedAdmin2Ids = this.selectedAdmin2Ids.filter(admin2Id => this.filteredAdmin2List.some(admin2 => admin2.id === admin2Id));
    }
    this.updateTotalStats();
    console.log(this.isAdmin1Visible);
  }

  onAdmin1Change(){
    if (this.selectedAdmin1Ids.length === 0){
      this.isAdmin2Visible = false;
      this.selectedAdmin2Ids = [];
      this.filteredAdmin2List = [];
    }
    else{
      this.filteredAdmin2List = this.filterService.getFilteredAdmin2(this.selectedAdmin1Ids, this.admin2List);
      this.selectedAdmin2Ids = this.selectedAdmin2Ids.filter(admin2Id => this.filteredAdmin2List.some(admin2 => admin2.id === admin2Id));
      this.isAdmin2Visible = true;
    }
    this.updateTotalStats();
  }

  applyFilters(){
    this.filterService.filterLayers(this.selectedAdmin0Ids, this.selectedAdmin1Ids, this.selectedAdmin2Ids);
    this.updateSelectedCodes();
    this.updateLayersStatistics();
  }

  clearFilters(){
    this.selectedAdmin0Ids = [];
    this.selectedAdmin1Ids = [];
    this.selectedAdmin2Ids = [];
    this.filteredAdmin1List = [];
    this.filteredAdmin2List = [];
    this.applyFilters();
    this.isAdmin1Visible = false;
    this.isAdmin2Visible = false;
  }

  updateTotalStats(){
    this.filterService.setLayersTotalStats({
      allAdmin0Count: this.admin0List.length,
      allAdmin1Count: this.filteredAdmin1List.length,
      allAdmin2Count: this.filteredAdmin2List.length,
    });
  }

  updateSelectedStats(){
    this.filterService.setLayersSelectedStats({
      selectedAdmin0Count: this.selectedAdmin0Ids.length,
      selectedAdmin1Count: this.selectedAdmin1Ids.length,
      selectedAdmin2Count: this.selectedAdmin2Ids.length
    });
  }
  updateLayersStatistics(){
    this.updateSelectedStats();
    this.updateTotalStats();
  }

  updateSelectedCodes(){
    this.filterService.setSelectedCodes({
      selectedAdmin0Codes: this.selectedAdmin0Ids,
      selectedAdmin1Codes: this.selectedAdmin1Ids,
      selectedAdmin2Codes: this.selectedAdmin2Ids,
    })
  }
}

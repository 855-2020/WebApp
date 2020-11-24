import { MatAccordion } from '@angular/material/expansion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SectorsService } from './../../services/sectors.service';
import { Sector } from 'src/app/models/Sector';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-simplified-model',
  templateUrl: './simplified-model.component.html',
  styleUrls: ['./simplified-model.component.scss']
})
export class SimplifiedModelComponent implements OnInit {
  // Base data
  sectors: Sector[] = [];
  availableSectors: Sector[] = [];
  showingSectors: Observable<Sector[]>;

  // Control
  hasError = false;
  isAdding = true;
  isLoading = true;
  isProcessing = false;

  // Input data
  selectedSector = new FormControl();
  selectedValue = new FormControl();
  usedSectors: Sector[] = [];
  values: number[] = [];

  // Results
  @ViewChild(MatAccordion) accordion: MatAccordion;

  results;
  impacts = [{ name: 'Impact 1', value: 294 }, { name: 'Impact 2', value: 17.48 }];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public impactsSectors: Label[][] = [
    ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E'],
    ['Sector C', 'Sector B', 'Sector E', 'Sector A', 'Sector D']
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public impactData: ChartDataSets[] = [
    { data: [80, 71, 55, 23, 11], label: 'Impact 1 ([unit])' },
    { data: [5, 3.58, 3.1, 2.47, 1.1], label: 'Impact 2 ([unit])' },
  ];

  constructor(
    private sectorsService: SectorsService,
  ) { }

  ngOnInit(): void {
    this.sectorsService.getSectors().then(sectors => {
      this.sectors = sectors;
      this.availableSectors = sectors.slice(0);
      this.showingSectors = this.selectedSector.valueChanges.pipe(
        startWith(''),
        map(value => this.filterSector(value))
      );
      this.isLoading = false;
    }).catch(err => {
      this.hasError = true;
      this.isLoading = false;
    });
  }

  filterSector(sectorName: string): Sector[] {
    if (sectorName) {
      return this.availableSectors.filter(s => {
        return s.name?.toUpperCase().indexOf(sectorName?.toUpperCase()) >= 0;
      });
    } else {
      return this.availableSectors;
    }
  }

  addSector(): void {
    if (this.selectedSector.valid && this.selectedValue.valid) {
      const sec = _.find(this.sectors, ['name', this.selectedSector.value]);
      this.usedSectors.push(sec);
      this.selectedSector.setValue(null);
      this.values.push(this.selectedValue.value);
      this.selectedValue.setValue(null);
      this.availableSectors.splice(this.availableSectors.indexOf(sec), 1);
    }
  }

  canAddSector(): boolean {
    return !!this.selectedValue.value && !!this.selectedSector.value &&
      !!_.find(this.availableSectors, ['name', this.selectedSector.value]);
  }

  clearAll(): void {
    this.usedSectors = [];
    this.availableSectors = this.sectors.slice(0);
    this.values = [];
    this.showingSectors = this.selectedSector.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSector(value))
    );
  }

  removeSector(i: number): void {
    this.usedSectors.splice(i, 1);
    this.values.splice(i, 1);
    this.availableSectors = _.filter(this.sectors, s => !_.find(this.usedSectors, ['name', s.name]));
    this.showingSectors = this.selectedSector.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSector(value))
    );
  }

  calculate(): void {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.results = [];
    }, 1000);
  }
}

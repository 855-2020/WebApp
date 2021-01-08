import { Model } from './../../models/Model';
import { ImpactService } from '../../services/impact.service';
import { MatAccordion } from '@angular/material/expansion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SectorsService } from '../../services/sectors.service';
import { Sector } from 'src/app/models/Sector';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ModelsService } from 'src/app/services/models.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-execute-model',
  templateUrl: './execute-model.component.html',
  styleUrls: ['./execute-model.component.scss']
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
  impacts = null;
  impactNames = [
    { id: '', name: '', unit: ''}
  ];

  value = [{ data: [4.55, 3.987, 1.54, 0.89, 0.763, 3.25], label: 'PIB (US$ million)' }];

  models: Model[] = [];
  selectedModel: Model;
  modelDetails: Model;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public impactsSectors: Label[][] = [
    ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E'],
    ['Sector C', 'Sector B', 'Sector E', 'Sector A', 'Sector D']
  ];
  public barChartType: ChartType = 'pie';
  public barChartLegend = true;
  public barChartPlugins = [];

  public impactData: ChartDataSets[] = [
    { data: [80, 71, 55, 23, 11], label: 'Impact 1 ([unit])' },
    { data: [5, 3.58, 3.1, 2.47, 1.1], label: 'Impact 2 ([unit])' },
  ];

  constructor(
    private impactService: ImpactService,
    private modelsService: ModelsService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getModels();
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

  async calculate(): Promise<void> {
    this.isProcessing = true;

    const params = {};
    this.usedSectors.forEach((v, i) => {
      params[v.id] = this.values[i];
    });

    try {
      // const impactNames = await this.impactService.getImpactNames();
      // console.log(impactNames);

      const xColumn = await this.impactService.getImpactValues(params);
      const matrix = await this.impactService.getIntermediateData(this.sectors, xColumn);

      this.results = this.combineData(matrix);
      this.impacts = _.map(this.results, (s, k) => ({ name: k, value: s, unit: null }));

      // this.impactsSectors = this.impacts.map(i)

    } catch (err) {
      console.error(err);
    } finally {
      this.isProcessing = false;
    }
  }

  combineData(data: any[]): any {
    return data.map(d => d.values).reduce((acc, d) => {
      Object.keys(d).forEach(k => {
        acc[k] = acc[k] ? acc[k] + d[k] || 0 : d[k];
      });
      return acc;
    }, {});
  }

  getModels(): void {
    this.isLoading = true;
    this.modelsService.getModels().then(models => {
      this.models = _.sortBy(models, ['name']);
    }).catch(err => {
      console.error('Error getting models', err);
      this.snackbar.open('Error getting models list', 'OK', {
        duration: 2000
      });
    }).finally(() => {
      this.isLoading = false;
    })
  }

  getModelDetails(e): void {
    this.isLoading = true;

    this.modelsService.getModel(e.value.id).then(model => {
      this.modelDetails = model;

      this.sectors = model.sectors;
      this.availableSectors = model.sectors.slice(0);
      this.showingSectors = this.selectedSector.valueChanges.pipe(
        startWith(''),
        map(value => this.filterSector(value))
      );

    }).catch(err => {
      console.error('Error getting model details', err);
      this.snackbar.open('Error getting model details', 'OK', {
        duration: 2000
      });
    }).finally(() => {
      this.isLoading = false;
    })

    this.isLoading = false;
  }
}

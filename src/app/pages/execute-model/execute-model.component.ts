import { FullMatrixComponent } from './../../components/full-matrix/full-matrix.component';
import { MatDialog } from '@angular/material/dialog';
import { Model } from './../../models/Model';
import { MatAccordion } from '@angular/material/expansion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Sector } from 'src/app/models/Sector';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ModelsService } from 'src/app/services/models.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/models/Category';
import { ChangeTechComponent } from 'src/app/components/change-tech/change-tech.component';

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
  categories: Category[] = [];
  matrix: number[][];
  changes: number[][] = null;

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

  results: number[];
  categoriesValues = [];

  models: Model[] = [];
  selectedModel: Model;
  modelDetails: Model;
  precision = 4;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      animateRotate: false
    },
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    private modelsService: ModelsService,
    private dialog: MatDialog,
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

    const data = {};
    this.usedSectors.forEach((v, i) => {
      data[this.sectors.indexOf(v)] = this.values[i];
    });

    this.modelsService.executeModel(this.selectedModel.id, data).then(results => {
      this.results = results.result;
      this.matrix = results.detailed;
      this.categories = results.categories;

      this.categoriesValues = this.results.map((r,i) => {
        let categoryValues = _.reverse(_.sortBy(this.matrix.map((r, mi) => ({ index: mi, value: r[i] })), ['value']));
        if (this.results?.length > 5) {
          return [ ...categoryValues.slice(0, 5), { index: null, value: categoryValues.slice(5).reduce((acc, v) => acc + v.value, 0) }];
        } else {
          return categoryValues;
        }
      })
    }).catch(err => {
      console.error('Error running model', err);
      this.snackbar.open('Error running model. Try again.', 'OK', {
        duration: 2000
      });
    }).finally(() => {
      this.isProcessing = false;
    })
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

    this.sectors = [];
    this.values = [];
    this.usedSectors = [];
    this.results = [];
    this.matrix = [];
    this.categories = [];
    this.categoriesValues = [];
    this.changes = null;

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

  getSum(v: any[]): number {
    return _.sumBy(v, 'value');
  }

  getLabels(i: number): string[] {
    return this.categoriesValues[i].map(c => c.index !== null ? this.sectors[c.index].name : 'Other');
  }

  getDatasets(i: number): ChartDataSets[] {
    return [{
      data: this.categoriesValues[i].map(c => c.value),
      label: `${this.categories[i].name} (${this.categories[i].unit})`
    }];
  }

  viewFullMatrix(): void {
    const matrix = [
      [ 'Sector Name', ..._.sortBy(this.categories, ['pos']).map(c => `${c.name} (${c.unit})`) ],
      ...this.matrix.map((l,i) => ([ this.sectors[i].name, ...l ]))
    ];


    this.dialog.open(FullMatrixComponent, {
      data: {
        matrix,
        modelName: this.selectedModel.name,
        precision: this.precision,
      }
    });
  }

  setPrecision(value: number): string {
    if (this.precision < 0) {
      this.precision = 0;
    }

    return value.toFixed(this.precision);
  }

  changeTech(): void {
    const dialogSubs = this.dialog.open(ChangeTechComponent, {
      data: {
        changes: this.changes,
        sectors: this.sectors.map(s => s.name),
      }
    }).afterClosed().subscribe((res: number[][]) => {
      this.changes = res;
      if(dialogSubs) { dialogSubs.unsubscribe(); }
    });
  }
}

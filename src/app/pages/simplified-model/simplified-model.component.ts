import { SectorsService } from './../../services/sectors.service';
import { Component, OnInit } from '@angular/core';
import { Sector } from 'src/app/models/Sector';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-simplified-model',
  templateUrl: './simplified-model.component.html',
  styleUrls: ['./simplified-model.component.scss']
})
export class SimplifiedModelComponent implements OnInit {

  sectors: Sector[] = [];
  usedSectors: Sector[] = [];
  availableSectors: Sector[] = [];
  showingSectors: Observable<Sector[]>;

  values: number[] = [];

  hasError = false;
  isLoading = true;
  isAdding = true;

  selectedSector = new FormControl();
  selectedValue = new FormControl();
  //   value: number;
  // } = { sector: null, value: null };

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

  }
}

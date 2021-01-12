import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-change-tech',
  templateUrl: './change-tech.component.html',
  styleUrls: ['./change-tech.component.scss']
})
export class ChangeTechComponent implements OnInit {
  sectors: string[];
  changes: number[][];
  precision: number;

  constructor(
    private dialogRef: MatDialogRef<ChangeTechComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.sectors = data.sectors;


    if (this.changes) {
      this.changes = data.changes
    } else {
      this.changes = Array(this.sectors.length).fill(Array(this.sectors.length).fill(0));
    }

    this.precision = data.precision;
   }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if(_.flattenDeep(this.changes).find(v => v != 0)) {
      this.dialogRef.close(this.changes);
    } else {
      this.dialogRef.close(null);
    }
  }

  indexTracker(index: number, value: any) {
    return value[index] ? value[index] : undefined;
  }

}

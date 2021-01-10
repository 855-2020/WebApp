import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-full-matrix',
  templateUrl: './full-matrix.component.html',
  styleUrls: ['./full-matrix.component.scss']
})
export class FullMatrixComponent implements OnInit {

  asc = true;
  sortIndex = null;

  matrix: any[][];

  constructor(
    private dialogRef: MatDialogRef<FullMatrixComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.matrix = data.matrix;
   }

  ngOnInit() {
    console.log(this.matrix);
  }

  sort(columnIndex: number): void {
    if (this.sortIndex === columnIndex) {
      this.asc = !this.asc;
    } else {
      this.asc = true;
      this.sortIndex = columnIndex;
    }

    let sorted = _.sortBy(this.matrix.slice(1), line => line[columnIndex]);

    if (!this.asc) {
      sorted = _.reverse(sorted);
    }

    console.log(sorted);


    this.matrix = [ this.matrix[0], ...sorted ];
  }

  close(): void {
    this.dialogRef.close();
  }
}

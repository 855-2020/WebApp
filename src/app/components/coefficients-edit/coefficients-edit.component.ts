import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { ModelsService } from 'src/app/services/models.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-coefficients-edit',
  templateUrl: './coefficients-edit.component.html',
  styleUrls: ['./coefficients-edit.component.scss'],
})
export class CoefficientEditComponent implements OnInit {
  mode: 'column' | 'row';
  rowHeaders: string[];
  columnHeaders: string[];
  values: number[];
  type: 'sectors' | 'impacts';
  matrix: number[][];
  pos: number;
  modelId: number;

  form: FormGroup;

  isLoading = true;

  constructor(
    private dialogRef: MatDialogRef<CoefficientEditComponent>,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private modelsService: ModelsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.mode = data.mode || 'row';
    this.type = data.type || 'sectors';
    this.columnHeaders = data.columnHeaders || [];
    this.rowHeaders = data.rowHeaders || [];
    this.pos = data.pos;
    this.matrix = data.matrix;
    this.modelId = data.modelId;

    if (this.matrix && this.pos < this.matrix.length) {

      if (this.mode === 'row') {
        this.values = [ ...this.matrix[this.pos] ];
      } else {
        this.values = this.matrix.map(r => r[this.pos]);
      }
    } else {
      this.values = Array(this.rowHeaders.length).fill(Array(this.columnHeaders.length).fill(0));
    }
   }

  ngOnInit() {
    this.fillForm().then(() => this.isLoading = false);
  }

  fillForm(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.form = this.formBuilder.group({
        values: this.formBuilder.control(
          this.values.map(c => new FormControl(c))
        )
      }, { updateOn: 'submit' });
      resolve();
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(event) {
    const confSubs = this.dialog.open(AlertDialogComponent, {
      data: {
        alertTitle: 'Confirm save',
        alertDescription: `Are you sure you want to save all coefficients of this ${this.mode}?`,
      }
    }).afterClosed().subscribe(async res => {
      if (res) {
        this.values = this.form.controls.values.value.map((r: FormControl) => r.value);

        try {
          if (this.mode === 'row') {
            this.matrix[this.pos] = this.values;
          } else {
            this.matrix.forEach((r, i) => r[this.pos] = this.values[i]);
          }

          if (this.type === 'sectors') {
            await this.modelsService.updateSectorsCoefficients(this.modelId, this.matrix);
          } else {
            await this.modelsService.updateImpactsCoefficients(this.modelId, this.matrix);
          }

          console.log('Saved coefficients', this.type);

          this.dialogRef.close(true);
        } catch (err) {
          console.error('Error saving coefficients', err);

          this.snackbar.open('Error saving coefficients', 'OK', {
            duration: 2000
          });
        }
      }

      if (confSubs) { confSubs.unsubscribe(); }
    });
  }

  clear(): void {
    const confSubs = this.dialog.open(AlertDialogComponent, {
      data: {
        alertTitle: 'Confirm clear',
        alertDescription: `Are you sure you want to clear all coefficients of this ${this.mode}?`,
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.isLoading = true;
        this.values = Array(this.values.length).fill(0);
        this.fillForm().then(() => this.isLoading = false);
      }

      if (confSubs) { confSubs.unsubscribe(); }
    });

  }
}

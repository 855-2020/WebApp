import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-change-tech',
  templateUrl: './change-tech.component.html',
  styleUrls: ['./change-tech.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeTechComponent implements OnInit {
  sectors: string[];
  changes: number[][];
  precision: number;

  form: FormGroup;

  isLoading = true;

  constructor(
    private dialogRef: MatDialogRef<ChangeTechComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.sectors = data.sectors;
    this.changes = data.changes;
    this.precision = data.precision;
   }

  ngOnInit() {
    if (!this.changes) {
      this.changes = Array(this.sectors.length).fill(Array(this.sectors.length).fill(0));
    } else {
      this.changes = this.changes.map(r => r.map(c => c * 100));
    }

    this.fillForm().then(() => this.isLoading = false);
  }

  fillForm(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.form = this.formBuilder.group({
        values: this.formBuilder.control(
          this.changes.map(
            r => this.formBuilder.array(
              r.map(c => new FormControl(c))
            )
          )
        )
      }, { updateOn: 'submit' });
      resolve();
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(event): void {
    this.changes = (this.form.controls.values as FormControl).value.map((r: FormArray) => r.controls.map((c: FormControl) => c.value / 100));

    if(_.flattenDeep(this.changes).find(v => v != 0)) {
      this.dialogRef.close(this.changes);
    } else {
      this.dialogRef.close(null);
    }
  }

  clear(): void {
    this.isLoading = true;
    this.changes = Array(this.sectors.length).fill(Array(this.sectors.length).fill(0));
    this.fillForm().then(() => this.isLoading = false);
  }
}

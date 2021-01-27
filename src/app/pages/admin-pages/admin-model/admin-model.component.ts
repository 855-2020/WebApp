import { AlertDialogComponent } from './../../../components/alert-dialog/alert-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Model } from 'src/app/models/Model';
import { Role } from 'src/app/models/Role';
import { ModelsService } from 'src/app/services/models.service';
import { RolesService } from 'src/app/services/roles.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-model',
  templateUrl: './admin-model.component.html',
  styleUrls: ['./admin-model.component.scss']
})
export class AdminModelComponent implements OnInit {

  isEdit = false;
  isLoading = true;
  modelId: number;

  roles: Role[];

  model: Model;

  modelFormGroup: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private modelsService: ModelsService,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    console.log(this.router.getCurrentNavigation());
    if (this.router.getCurrentNavigation()?.extras?.state?.model) {
      this.model = this.router.getCurrentNavigation().extras.state.model;
    }
  }

  async ngOnInit() {
    this.modelFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      descriptionCtrl: new FormControl('', []),
      rolesCtrl: new FormControl(),
      sectorsCtrl: new FormControl([]),
      impactsCtrl: new FormControl([]),
    });

    this.getRoles();

    if (!this.model) {
      const params = await this.route.params.pipe(take(1)).toPromise();
      this.modelId = params.modelId && parseInt(params.modelId);

      if (params.modelId) {
        this.isEdit = true;
        this.getModel();
      } else {
        this.isLoading = false;
      }
    } else {
      this.fillForm();
      this.isLoading = false;
    }
  }

  getModel(): void {
    this.isLoading = true;

    this.modelsService.getModel(this.modelId).then(model => {
      this.model = model;
      console.log(model);

      this.fillForm();
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

  fillForm(): void {
    const model = this.model;

    this.modelFormGroup.controls.nameCtrl.setValue(model.name || '');
    this.modelFormGroup.controls.descriptionCtrl.setValue(model.description || '');
    this.modelFormGroup.controls.sectorsCtrl.setValue(model.sectors);
    this.modelFormGroup.controls.impactsCtrl.setValue(model.categories);
    this.modelFormGroup.controls.rolesCtrl.setValue(model.roles?.map(r => r.id) || []);
  }

  getRoles(): void {
    this.rolesService.getRoles().then(roles => {
      this.roles = _.sortBy(roles, ['name']);
    }).catch(err => {
      console.error('Error getting roles', err);
      this.roles = [];
    });
  }

  editModel() {

  }

  createModel() {

  }

  async copyModel() {
    if (!this.wasEdited() || await this.confirmExit()) {
      this.modelsService.cloneModel(this.modelId).then(model => {
        this.router.navigate(['/admin/models/create'], { state: { model } });
      }).catch(err => {
        console.error('Error cloning model', err);
        this.snackbar.open('Error making a copy of this model', 'OK', {
          duration: 2000
        });
      })
    }
  }

  wasEdited() {
    return true;
  }

  async confirmExit(): Promise<boolean> {
    return !!(await this.dialog.open(AlertDialogComponent, {
      data: {
        alertTitle: 'Discard changes',
        alertDescription: 'You have unsaved changes. Are you sure you want to continue?'
      }
    }).afterClosed().pipe(take(1)).toPromise());
  }

  compareById(item1, item2): boolean {
    return item1?.id === item2?.id;
  }
}

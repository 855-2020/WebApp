import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Model } from 'src/app/models/Model';
import { Role } from 'src/app/models/Role';
import { ModelsService } from 'src/app/services/models.service';
import { RolesService } from 'src/app/services/roles.service';

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
    private snackbar: MatSnackBar,
  ) { }

  async ngOnInit() {
    const params = await this.route.params.pipe(take(1)).toPromise();
    this.modelId = params.modelId && parseInt(params.modelId);

    this.modelFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      descriptionCtrl: new FormControl('', []),
      rolesCtrl: new FormControl(),
      sectorsCtrl: new FormControl(),
    });

    this.getRoles();

    if (params.modelId) {
      this.isEdit = true;
      this.getModel();
    } else {
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
}

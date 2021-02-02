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
import { CoefficientEditComponent } from 'src/app/components/coefficients-edit/coefficients-edit.component';

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

  newImpact = {
    name: '',
    description: '',
    unit: ''
  };

  newSector = {
    name: ''
  };

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
      this.model = {
        ...model,
        categories: _.sortBy(model?.categories || [], ['pos']),
        sectors: _.sortBy(model?.sectors || [], ['pos']),
      };

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

  saveRoles(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const currentRoles = this.model?.roles?.map(r => r.id) || [];
      const selectedRoles = this.modelFormGroup.get('rolesCtrl').value || [];

      const rolesToAdd = _.difference(selectedRoles, currentRoles);
      const rolesToRemove = _.difference(currentRoles, selectedRoles);

      const changes = [];

      if (rolesToAdd.length) {
        changes.push(this.modelsService.addRolesToModel(this.modelId, rolesToAdd));
      }

      if (rolesToRemove.length) {
        changes.push(this.modelsService.removeRolesFromModel(this.modelId, rolesToRemove));
      }

      Promise.all(changes).then(res => {
        console.log('Finished changing roles');
        resolve();
      }).catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  editModel() {
    return new Promise<void>((resolve, reject) => {
      if(this.modelFormGroup.valid) {
        const data = {
          name: (this.modelFormGroup.get('nameCtrl').value as string).trim(),
          description: (this.modelFormGroup.get('descriptionCtrl').value as string).trim(),
        }

        Promise.all([
          this.modelsService.editModel(this.modelId, data),
          this.saveRoles(),
        ]).then(res => {
          this.getModel();

          this.snackbar.open('Model saved successfully', 'OK', {
            duration: 2000
          });

          resolve();
        }).catch(err => {
          console.error('Error saving model data', err);

          this.snackbar.open('Error saving model data', 'OK', {
            duration: 2000
          });

          reject(err);
        });
      }
    });
  }

  createModel() {
    return new Promise<void>((resolve, reject) => {
      if(this.modelFormGroup.valid) {
        const data = {
          name: (this.modelFormGroup.get('nameCtrl').value as string).trim(),
          description: (this.modelFormGroup.get('descriptionCtrl').value as string).trim(),
          roles: this.modelFormGroup.get('rolesCtrl').value || []
        }

        this.modelsService.createModel(data.name, data.description, data.roles).then(res => {
          this.snackbar.open('Model created successfully', 'OK', {
            duration: 2000
          });

          this.router.navigate(['/admin/models', res.id, 'edit'])
        }).catch(err => {
          console.error('Error creating model', err);

          this.snackbar.open('Error creating model', 'OK', {
            duration: 2000
          });

          reject(err);
        });
      }
    });
  }

  async copyModel() {
    this.showConfirmation(
      'Copy model',
      'Are you sure that you want to make a copy of this model? All unsaved changes will be lost.'
    ).then(res => {
      if (res) {
        this.modelsService.cloneModel(this.modelId).then(model => {
          this.router.navigate(['/admin/models', model.id, 'edit']);
          this.modelId = model.id;
          this.getModel();
        }).catch(err => {
          console.error('Error cloning model', err);
          this.snackbar.open('Error making a copy of this model', 'OK', {
            duration: 2000
          });
        })
      }
    })
  }

  deleteModel(): void {
    this.showConfirmation(
      'Delete model',
      'Are you sure that you want to delete this model? This action can not be undone.'
    ).then(res => {
      if (res) {
        this.modelsService.deleteModel(this.modelId).then(() => {
          this.snackbar.open('Model was deleted successfully', 'OK', {
            duration: 2000
          });
          this.router.navigate(['/admin/models']);

        }).catch(err => {
          console.error('Error deleting model', err);
          this.snackbar.open('Error deleting model', 'OK', {
            duration: 2000
          });
        });
      }
    });
  }

  wasEdited() {
    return false;
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

  editImpactCoefficients(impact) {
    const dialogSubs = this.dialog.open(CoefficientEditComponent, {
      data: {
        rowHeaders: [impact.name],
        columnHeaders: this.model.sectors.map(s => s.name),
        mode: 'row',
        matrix: this.model.catimpct_matrix,
        pos: impact.pos,
        type: 'impacts',
        modelId: this.modelId,
      },
      disableClose: true,
      minWidth: '350px',
      minHeight: '350px'
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.getModel();
      }

      if(dialogSubs) { dialogSubs.unsubscribe(); }
    });
  }

  editSectorsCoefficients(sector, isRow = true) {
    let data;

    if (isRow) {
      data = {
        rowHeaders: [sector.name],
        columnHeaders: this.model.sectors.map(s => s.name),
        mode: 'row',
        matrix: this.model.economic_matrix,
        pos: sector.pos,
        type: 'sectors',
        modelId: this.modelId,
      };
    } else {
      data = {
        rowHeaders: this.model.sectors.map(s => s.name),
        columnHeaders: [sector.name],
        mode: 'column',
        matrix: this.model.economic_matrix,
        pos: sector.pos,
        type: 'sectors',
        modelId: this.modelId,
      };
    }

    const dialogSubs = this.dialog.open(CoefficientEditComponent, {
      data,
      disableClose: true,
      minWidth: '350px',
      minHeight: '350px'
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.getModel();
      }

      if(dialogSubs) { dialogSubs.unsubscribe(); }
    });
  }

  addImpact(): void {
    if (this.newImpact.name) {
      this.isLoading = true;

      const impactData = {
        pos: 0,
        name: this.newImpact.name.trim(),
        description: this.newImpact.description?.trim(),
        unit: this.newImpact.unit?.trim(),
        impacts: Array(this.model.sectors.length).fill(0)
      };

      this.modelsService.addImpact(this.modelId, impactData).then(() => {
        this.snackbar.open('Impact category was added successfully', 'OK', {
          duration: 2000
        });

        this.newImpact = {
          name: '',
          description: '',
          unit: ''
        };

        this.getModel();
      }).catch(err => {
        console.error('Error adding impact', err);
        this.snackbar.open('Error adding impact category', 'OK', {
          duration: 2000
        });
        this.isLoading = false;
      });
    }
  }

  addSector(): void {
    if (this.newSector.name) {
      this.isLoading = true;

      const sectorData = {
        pos: 0,
        name: this.newSector.name.trim(),
        value_added: 0,
        direct: Array(this.model.sectors.length + 1).fill(0),
        reverse: Array(this.model.sectors.length).fill(0),
        impacts: Array(this.model.categories.length).fill(0)
      };

      this.modelsService.addSector(this.modelId, sectorData).then(() => {
        this.snackbar.open('Sector was added successfully', 'OK', {
          duration: 2000
        });

        this.newSector = {
          name: '',
        };

        this.getModel();
      }).catch(err => {
        console.error('Error adding sector', err);
        this.snackbar.open('Error adding sector', 'OK', {
          duration: 2000
        });
        this.isLoading = false;
      });
    }
  }

  deleteImpact(index: number): void {
    this.showConfirmation(
      'Delete impact category',
      'Are you sure that you want to delete this impact category from this model? This action can not be undone.'
    ).then(res => {
      if (res) {
        this.isLoading = true;

        this.modelsService.deleteImpact(this.modelId, this.model.categories[index].pos).then(() => {
          this.snackbar.open('Impact category was deleted successfully', 'OK', {
            duration: 2000
          });
          this.getModel();
        }).catch(err => {
          console.error('Error deleting impact', index, err);
          this.snackbar.open('Error deleting impact category', 'OK', {
            duration: 2000
          });
          this.isLoading = false;
        });
      }
    });
  }

  deleteSector(index: number): void {
    this.showConfirmation(
      'Delete sector',
      'Are you sure that you want to delete this sector from this model? This action can not be undone.'
    ).then(res => {
      if (res) {
        this.isLoading = true;

        this.modelsService.deleteSector(this.modelId, this.model.sectors[index].pos).then(() => {
          this.snackbar.open('Sector was deleted successfully', 'OK', {
            duration: 2000
          });
          this.getModel();
        }).catch(err => {
          console.error('Error deleting sector', index, err);
          this.snackbar.open('Error deleting sector', 'OK', {
            duration: 2000
          });
          this.isLoading = false;
        });
      }
    });
  }

  editImpact(index: number) {
    if (this.model?.categories[index]?.name) {
      this.isLoading = true;

      const impactData = {
        name: this.model?.categories[index]?.name.trim(),
        description: (this.model?.categories[index]?.description || '')?.trim(),
        unit: (this.model?.categories[index]?.unit || '')?.trim(),
      };

      this.modelsService.editImpact(this.modelId, this.model?.categories[index]?.pos, impactData).then(() => {
        this.snackbar.open('Impact category was saved successfully', 'OK', {
          duration: 2000
        });

        this.getModel();
      }).catch(err => {
        console.error('Error saving impact', err);
        this.snackbar.open('Error saving impact category', 'OK', {
          duration: 2000
        });
        this.isLoading = false;
      });
    }
  }

  editSector(index: number) {
    if (this.model?.sectors[index]?.name) {
      this.isLoading = true;

      const sectorData = {
        name: this.model?.sectors[index]?.name.trim(),
      };

      this.modelsService.editSector(this.modelId, this.model?.sectors[index]?.pos, sectorData).then(() => {
        this.snackbar.open('Sector was saved successfully', 'OK', {
          duration: 2000
        });

        this.getModel();
      }).catch(err => {
        console.error('Error saving sector', err);
        this.snackbar.open('Error saving sector', 'OK', {
          duration: 2000
        });
        this.isLoading = false;
      });
    }
  }

  showConfirmation(title: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const confSubs = this.dialog.open(AlertDialogComponent, {
        data: {
          alertTitle: title,
          alertDescription: message,
        }
      }).afterClosed().subscribe(res => {
        if (confSubs) { confSubs.unsubscribe(); }
        resolve(!!res);
      });
    })
  }
}

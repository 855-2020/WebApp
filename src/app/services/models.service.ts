import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Model } from '../models/Model';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor(
    private auth: AuthService,
    private http: HttpClient,
  ) { }

  getModel(id: number): Promise<Model> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/models/${id}/get`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res as Model);
      }).catch(err => {
        console.error('Error getting model', err);
        reject(err);
      });
    });
  }

  getModels(): Promise<Model[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/models/list`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res as Model[]);
      }).catch(err => {
        console.error('Error getting models', err);
        reject(err);
      });
    });
  }

  executeModel(id: number, values: any, technologyChanges: number[][] = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${id}/simulate`, { values, change: technologyChanges }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res);
      }).catch(err => {
        console.error('Error running model', err);
        reject(err);
      });
    });
  }

  cloneModel(id: number): Promise<Model> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${id}/clone`, {}, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then((res: any) => {
        this.http.post(`${environment.apiUrl}/models/${res.id}/persist`, {}, {
          headers: {
            ...this.auth.getHeaders(),
          }
        }).toPromise().then((cloned: any) => {
          resolve(cloned);
        }).catch(err => {
          console.error('Error persisting cloned model', err);
          reject(err);
        });
      }).catch(err => {
        console.error('Error cloning model', err);
        reject(err);
      });
    });
  }

  createModel(name: string, description = '', roles: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/new?name=${name}&description=${description}`, roles, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res);
      }).catch(err => {
        console.error('Error creating model', err);
        reject(err);
      });
    });
  }

  editModel(modelId: number, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(data);

      this.http.post(`${environment.apiUrl}/models/${modelId}/modify?name=${data.name}&description=${data.description}`, {}, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error adding sector to model', err);
        reject(err);
      });
    });
  }

  deleteModel(modelId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${environment.apiUrl}/models/${modelId}`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error deleting model', err);
        reject(err);
      });
    });
  }

  addRolesToModel(modelId: number, roleIds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/add_roles`, roleIds, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished adding roles');
        resolve(res);
      }).catch(err => {
        console.error('Error adding roles', err);
        reject(err);
      });
    });
  }

  removeRolesFromModel(modelId: number, roleIds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/remove_roles`, roleIds, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished removing roles');
        resolve(res);
      }).catch(err => {
        console.error('Error removing roles', err);
        reject(err);
      });
    });
  }

  // SECTORS
  addSector(modelId: number, sectorData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/sector/new`, { ...sectorData }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error adding sector to model', err);
        reject(err);
      });
    });
  }

  editSector(modelId: number, pos: number, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/sector/${pos}/modify?name=${data.name}`, {}, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error editing sector', err);
        reject(err);
      });
    });
  }

  updateSectorsCoefficients(modelId: number, values: number[][]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/coefs/update`, { values }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error updating sectors coefficients of model', err);
        reject(err);
      });
    });
  }

  deleteSector(modelId: number, sectorPosition: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${environment.apiUrl}/models/${modelId}/sector/${sectorPosition}`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error deleting model sector', err);
        reject(err);
      });
    });
  }

  // IMPACTS
  addImpact(modelId: number, impactData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/impact/new`, { ...impactData }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error adding impact to model', err);
        reject(err);
      });
    });
  }

  editImpact(modelId: number, pos: number, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/impact/${pos}/modify?name=${data.name}&description=${data.description}&unit=${data.unit}`, {}, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error editing impact', err);
        reject(err);
      });
    });
  }

  updateImpactsCoefficients(modelId: number, values: number[][]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${modelId}/impacts/update`, { values }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error updating impact coefficients of model', err);
        reject(err);
      });
    });
  }

  deleteImpact(modelId: number, impactPosition: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${environment.apiUrl}/models/${modelId}/impact/${impactPosition}`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(() => {
        resolve();
      }).catch(err => {
        console.error('Error deleting model impact', err);
        reject(err);
      });
    });
  }

}

import { ModelsService } from './../../../services/models.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-models',
  templateUrl: './admin-models.component.html',
  styleUrls: ['./admin-models.component.scss']
})
export class AdminModelsComponent implements OnInit {

  models/* : Model[] */ = [];
  filterValue = '';
  isLoading = true;

  constructor(
    private modelsService: ModelsService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getModels();
  }

  getModels(): void {
    this.isLoading = true;

    this.modelsService.getModels().then(models => {
      this.models = models;

      this.isLoading = false;
    }).catch(err => {
      console.error('Error getting roles');
      this.snackbar.open('Error getting roles', 'OK', {
        duration: 2000
      });
      this.isLoading = false;
    })

    // this.adminUsersService.searchUsers({
    //   filterField: this.selectedFilter.name,
    //   filterValue: this.filterValue,
    //   orderField: this.sortField,
    //   orderDirection: this.sortDirection,
    //   pageSize: this.pageSize,
    //   page: this.currentPage,
    // })/* .then(users => {
    //   this.length = users.total;
    //   this.usersDataSource = new MatTableDataSource(users.results);
    //   this.usersDataSource.paginator = this.paginator;
    //   this.usersDataSource.sort = this.sort;
    // }).catch(err => {
    //   console.error('Cannot get users');
    // }).finally(() => {
    //   this.isLoading = false;
    // }) */
  }

  clearFilter(): void {
    this.filterValue = '';
    this.getModels();
  }

}

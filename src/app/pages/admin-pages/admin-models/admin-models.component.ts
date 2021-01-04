import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-models',
  templateUrl: './admin-models.component.html',
  styleUrls: ['./admin-models.component.scss']
})
export class AdminModelsComponent implements OnInit {

  filterValue = '';
  isLoading = true;

  constructor() { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.isLoading = true;

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
    this.applyFilter();
  }

}

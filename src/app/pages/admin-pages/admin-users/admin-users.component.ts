import { SortDirection } from './../../../models/Common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User';
import { AdminUsersService } from 'src/app/services/admin-users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  readonly filterFields = [
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'email',
      label: 'E-mail'
    },
    {
      name: 'status',
      label: 'Status'
    },
    {
      name: 'type',
      label: 'Type'
    }
  ];

  readonly userRoles = [
    {
      name: 'common-user',
      label: 'Participante',
    },
    {
      name: 'admin',
      label: 'Admin',
    },
  ]

  displayedColumns: string[] = ['name', 'email', 'status', 'type', 'actions'];
  usersDataSource: MatTableDataSource<User>;

  // Filter
  selectedFilter = this.filterFields[0];
  filterValue = '';
  currentFilterValue = '';

  // Pagination
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [25, 50, 100];
  currentPage = 0;

  // Sorting
  sortField = 'name';
  sortDirection: SortDirection = SortDirection.asc;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isLoading = true;

  constructor(
    private adminUsersService: AdminUsersService,
  ) { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.isLoading = true;

    this.adminUsersService.searchUsers({
      filterField: this.selectedFilter.name,
      filterValue: this.filterValue,
      orderField: this.sortField,
      orderDirection: this.sortDirection,
      pageSize: this.pageSize,
      page: this.currentPage,
    })/* .then(users => {
      this.length = users.total;
      this.usersDataSource = new MatTableDataSource(users.results);
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
    }).catch(err => {
      console.error('Cannot get users');
    }).finally(() => {
      this.isLoading = false;
    }) */
  }

  setPageSizeOptions(setPageSizeOptionsInput: string): void {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  paginatorEvent(event: PageEvent): void {
    if(event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.currentPage = 0;
    } else {
      this.currentPage = event.pageIndex;
      console.log(this.currentPage, this.pageSize);
    }
    this.applyFilter();
  }

  sortData(event: Sort): void {
    this.sortDirection = event?.direction === 'desc' ? SortDirection.desc : SortDirection.asc;
    this.sortField = event.active;
    this.currentPage = 0;
    this.applyFilter();
  }

  clearFilter(): void {
    this.currentFilterValue = '';
    this.filterValue = '';
    this.currentPage = 0;
    this.applyFilter();
  }
}

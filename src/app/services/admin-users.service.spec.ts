/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminUsersService } from './admin-users.service';

describe('Service: AdminUsers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminUsersService]
    });
  });

  it('should ...', inject([AdminUsersService], (service: AdminUsersService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImpactService } from './impact.service';

describe('Service: Impact', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImpactService]
    });
  });

  it('should ...', inject([ImpactService], (service: ImpactService) => {
    expect(service).toBeTruthy();
  }));
});

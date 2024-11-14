import { TestBed } from '@angular/core/testing';

import { SpellCheckService } from './spell-check.service';

describe('SpellCheckService', () => {
  let service: SpellCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpellCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GamesocketService } from './gamesocket.service';

describe('GamesocketService', () => {
  let service: GamesocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

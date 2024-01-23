import { Test, TestingModule } from '@nestjs/testing';
import { PassCancelDetailsService } from './pass-cancel-details.service';

describe('PassCancelDetailsService', () => {
  let service: PassCancelDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassCancelDetailsService],
    }).compile();

    service = module.get<PassCancelDetailsService>(PassCancelDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

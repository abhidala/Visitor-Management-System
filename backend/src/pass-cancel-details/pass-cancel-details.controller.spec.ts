import { Test, TestingModule } from '@nestjs/testing';
import { PassCancelDetailsController } from './pass-cancel-details.controller';
import { PassCancelDetailsService } from './pass-cancel-details.service';

describe('PassCancelDetailsController', () => {
  let controller: PassCancelDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassCancelDetailsController],
      providers: [PassCancelDetailsService],
    }).compile();

    controller = module.get<PassCancelDetailsController>(PassCancelDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

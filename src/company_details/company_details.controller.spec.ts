import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDetailsController } from './company_details.controller';

describe('CompanyDetailsController', () => {
  let controller: CompanyDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyDetailsController],
    }).compile();

    controller = module.get<CompanyDetailsController>(CompanyDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

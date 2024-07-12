import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDetailsService } from './company_details.service';
import { CompanyDetailsController } from './company_details.controller';
import { CompanyDetails } from './entity/company_details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDetails])],
  providers: [CompanyDetailsService],
  controllers: [CompanyDetailsController],
})
export class CompanyDetailsModule {}

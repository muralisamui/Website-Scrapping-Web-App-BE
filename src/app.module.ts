import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyDetailsModule } from './company_details/company_details.module';
import { CompanyDetails } from './company_details/entity/company_details.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'web_scraper_db',
      entities: [CompanyDetails],
      synchronize: true,
    }),
    CompanyDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

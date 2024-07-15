import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyDetailsModule } from './company_details/company_details.module';
import { CompanyDetails } from './company_details/entity/company_details.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DBNAME,
      entities: [CompanyDetails],
      synchronize: true,
    }),
    CompanyDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

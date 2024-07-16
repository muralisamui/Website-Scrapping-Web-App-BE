import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyDetailsModule } from './company_details/company_details.module';
import { CompanyDetails } from './company_details/entity/company_details.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('POSTGRES_URI'),
        synchronize: true, // Set to true only for development
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: ['dist/subscriber/**/*.js'],
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    CompanyDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { DataSource } from 'typeorm';
import { CompanyDetails } from './company_details/entity/company_details.entity';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME,
    entities: [CompanyDetails],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
});

export default dataSource;

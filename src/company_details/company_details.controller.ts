import { Controller, Get, Query, Param, Delete, Body, ParseArrayPipe, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CompanyDetailsService } from './company_details.service';
import { CompanyDetails } from './entity/company_details.entity';
import { DeleteMultipleCompaniesDto } from './dto/delete-multiple-companies.dto';

@Controller('company-details')
export class CompanyDetailsController {
    constructor(private readonly companyDetailsService: CompanyDetailsService) { }

    @Get('scrape')
    async scrape(@Query('url') url: string): Promise<CompanyDetails> {
        return this.companyDetailsService.scrapeWebsite(url);
    }

    // @Get()
    // async getAllCompanies(): Promise<CompanyDetails[]> {
    //     return this.companyDetailsService.getAllCompanies();
    // }

    @Get(':id')
    async getCompanyById(@Param('id') id: number): Promise<CompanyDetails> {
        return this.companyDetailsService.getCompanyById(id);
    }

    @Get()
    async getCompaniesPaginated(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ): Promise<{ items: CompanyDetails[], meta: any }> {
        return this.companyDetailsService.getCompaniesPaginated(page, limit);
    }

    @Delete(':id')
    async deleteCompany(@Param('id') id: number): Promise<void> {
        return this.companyDetailsService.deleteCompany(id);
    }

    @Delete()
    async deleteMultipleCompanies(
        @Body() deleteMultipleCompaniesDto: DeleteMultipleCompaniesDto,
    ): Promise<void> {
        const { ids } = deleteMultipleCompaniesDto;
        return this.companyDetailsService.deleteMultipleCompanies(ids);
    }
}

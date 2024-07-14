import { Controller, Get, Query, Param, Delete, Body, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CompanyDetailsService } from './company_details.service';
import { CompanyDetails } from './entity/company_details.entity';
import { DeleteMultipleCompaniesDto } from './dto/delete-multiple-companies.dto';

@Controller('company-details')
export class CompanyDetailsController {
    constructor(private readonly companyDetailsService: CompanyDetailsService) { }

    @Get('scrape')
    async scrape(@Query('url') url: string): Promise<CompanyDetails> {
        try {
            return await this.companyDetailsService.scrapeWebsite(url);
        } catch (error) {
            throw new HttpException(`Failed to scrape website: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async getCompanyById(@Param('id') id: number): Promise<CompanyDetails> {
        try {
            return await this.companyDetailsService.getCompanyById(id);
        } catch (error) {
            throw new Error(`Failed to get company with: ${id}`)
        }
    }

    @Get()
    async getCompaniesPaginated(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ): Promise<{ items: CompanyDetails[], meta: any }> {
        try {
            return this.companyDetailsService.getCompaniesPaginated(page, limit);
        } catch (error) {
            throw new Error(`Failed to fetch paginated companies: ${error.message}`);
        }
    }

    @Delete(':id')
    async deleteCompany(@Param('id') id: number): Promise<void> {
        try {
            return await this.companyDetailsService.deleteCompany(id);
        } catch (error) {
            throw new Error(`Failed to delete company: ${error.message}`);
        }
    }

    @Delete()
    async deleteMultipleCompanies(
        @Body() deleteMultipleCompaniesDto: DeleteMultipleCompaniesDto,
    ): Promise<void> {
        try {
            const { ids } = deleteMultipleCompaniesDto;
            return await this.companyDetailsService.deleteMultipleCompanies(ids);
        } catch (error) {
            throw new Error(`Failed to delete multiple companies: ${error.message}`);
        }
    }
}

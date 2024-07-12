import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CompanyDetails } from './entity/company_details.entity';

@Injectable()
export class CompanyDetailsService {
    constructor(
        @InjectRepository(CompanyDetails)
        private readonly companyDetailsRepository: Repository<CompanyDetails>,
    ) { }

    async scrapeWebsite(url: string): Promise<CompanyDetails> {
        let existingCompany = await this.companyDetailsRepository.findOne({ where: { url } });
        if (existingCompany) {
            return existingCompany;
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        await browser.close();

        const $ = cheerio.load(content);
        const name = $('meta[property="og:site_name"]').attr('content') || $('title').text();
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
        const logo = $('meta[property="og:image"]').attr('content');
        const facebook = $('a[href*="facebook.com"]').attr('href');
        const linkedin = $('a[href*="linkedin.com"]').attr('href');
        const twitter = $('a[href*="twitter.com"]').attr('href');
        const instagram = $('a[href*="instagram.com"]').attr('href');
        const address = $('address').text();
        const phone = $('a[href^="tel:"]').attr('href')?.replace('tel:', '');
        const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '');

        const companyDetails = this.companyDetailsRepository.create({
            url,
            name,
            description,
            logo,
            facebook,
            linkedin,
            twitter,
            instagram,
            address,
            phone,
            email,
        });

        return this.companyDetailsRepository.save(companyDetails);
    }

    async getAllCompanies(): Promise<CompanyDetails[]> {
        return this.companyDetailsRepository.find();
    }

    async getCompanyById(id: number): Promise<CompanyDetails> {
        const company = await this.companyDetailsRepository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async deleteCompany(id: number): Promise<void> {
        await this.companyDetailsRepository.delete(id);
    }

    async deleteMultipleCompanies(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.companyDetailsRepository.delete(id);
        }
    }

    async getCompaniesPaginated(page: number, limit: number): Promise<{ items: CompanyDetails[], meta: any }> {
        const [items, total] = await this.companyDetailsRepository.createQueryBuilder('companyDetails')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items,
            meta: {
                totalItems: total,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            }
        };
    }
}

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
        try {

            let existingCompany = await this.companyDetailsRepository.findOne({ where: { url } });
            if (existingCompany) {
                return existingCompany;
            }

            const browser = await puppeteer.launch({
                executablePath: '/opt/render/.cache/puppeteer/chrome', 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                // /opt/render/.cache/puppeteer/chrome)"
            });
            const page = await browser.newPage();
            await page.goto(url);
            const content = await page.content();
            await page.setViewport({ width: 1280, height: 720 });
            const screenshotBuffer = await page.screenshot({ fullPage: true });
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
                screenshot: screenshotBuffer,
            });

            return this.companyDetailsRepository.save(companyDetails);

        } catch (error: any) {
            throw new Error(`Failed to scrape website: ${error.message}`);
        }

    }

    async getAllCompanies(): Promise<CompanyDetails[]> {
        try {
            return await this.companyDetailsRepository.find();
        } catch (error) {
            throw new Error(`Failed to fetch companies: ${error.message}`);
        }
    }

    async getCompanyById(id: number): Promise<CompanyDetails> {

        try {
            const company = await this.companyDetailsRepository.findOne({ where: { id } });
            if (!company) {
                throw new NotFoundException(`Company with ID ${id} not found`);
            }
            return company;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new Error(`Failed to fetch company with ID ${id}: ${error.message}`);
            }
        }
    }

    async deleteCompany(id: number): Promise<void> {
        try {
            const result = await this.companyDetailsRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Company with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new Error(`Failed to delete company with ID ${id}: ${error.message}`);
            }
        }
    }

    async deleteMultipleCompanies(ids: number[]): Promise<void> {
        try {
            const result = await this.companyDetailsRepository.delete(ids);
            if (result.affected !== ids.length) {
                throw new NotFoundException(`One or more companies were not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new Error(`Failed to delete multiple companies: ${error.message}`);
            }
        }
    }

    async getCompaniesPaginated(page: number, limit: number): Promise<{ items: CompanyDetails[], meta: any }> {

        if (page < 1 || limit < 1) {
            throw new Error('Invalid pagination parameters');
        }

        try {
            const [items, total] = await this.companyDetailsRepository
                .createQueryBuilder('companyDetails')
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
        } catch (error) {
            throw new Error(`Failed to fetch paginated companies: ${error.message}`);
        }
    }
}

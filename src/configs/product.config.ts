import { registerAs } from '@nestjs/config';

export default registerAs(
    'product',
    (): Record<string, any> => ({
        name: process.env?.PRODUCT_NAME ?? 'comeari',
        url: process.env?.PRODUCT_URL,
        company: process?.env.COMPANY_NAME ?? 'Comecari Nigeria',
        address: process?.env.COMPANY_ADDRESS ?? 'Nigeria'
    })
);

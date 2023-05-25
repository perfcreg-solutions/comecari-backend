import { registerAs } from '@nestjs/config';

export default registerAs(
    'youverify',
    (): Record<string, any> => ({
        url: process.env?.YOUVERIFY_URL,
        key: process.env?.YOUVERIFY_API_KEY,
    })
);

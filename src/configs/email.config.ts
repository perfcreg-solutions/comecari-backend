import { registerAs } from '@nestjs/config';

export default registerAs(
    'email',
    (): Record<string, any> => ({
        server: process.env?.EMAIL_SERVER ?? 'smtp.postmarkapp.com',
        key: process.env?.EMAIL_KEY,
        port: process?.env.EMAIL_PORT
    })
);

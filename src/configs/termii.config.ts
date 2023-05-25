import { registerAs } from '@nestjs/config';

export default registerAs(
    'termii',
    (): Record<string, any> => ({
        url: process.env?.TERMII_URL,
        key: process.env?.TERMII_KEY,
        sender_id: process?.env.TERMII_SENDER,
        channel: process?.env.TERMII_CHANNEL
    })
);

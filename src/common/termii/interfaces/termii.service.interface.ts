import {
    TermiiCreateDto,
} from 'src/common/termii/dtos/termii.create.dto';
import { TermiiDoc } from 'src/common/termii/repository/entities/termii.entity';

export interface ITermiiService {
    sendToken({
        mobileNumber
    }: TermiiCreateDto): Promise<TermiiDoc>;
    
}

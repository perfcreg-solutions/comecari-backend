import { OmitType } from '@nestjs/swagger';
import { CompanyGetSerialization } from './company.get.serialization';
export class CompanyListSerialization extends OmitType(CompanyGetSerialization, [
  
] as const) {
    
}

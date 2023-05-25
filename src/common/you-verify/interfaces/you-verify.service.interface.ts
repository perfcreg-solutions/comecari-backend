import { VerifyLicenseDto } from "src/common/you-verify/dtos/verify-license.dto";
export interface YouVerifyServiceInterface {

verifyLicense(verifyLicense: VerifyLicenseDto): Promise<void>;
}

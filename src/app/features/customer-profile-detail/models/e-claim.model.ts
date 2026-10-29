export interface EClaim {
  partyId: number;
  policyId: number;
  eclaimId: number;
  createdDate: string;
  receiptImages: string[];
  medicalCertificates: string[];
  otherDocuments: string[];
  createdBy: string;
  patientType: string;
}

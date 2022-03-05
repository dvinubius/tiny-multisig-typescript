export interface MSVaultEntity {
  idx: number;
  address: string;
  name: string;
  time: Date;
  creator: string;
  owners: string[];
  confirmationsRequired: number;
}

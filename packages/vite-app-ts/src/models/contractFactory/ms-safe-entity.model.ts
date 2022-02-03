export interface MSSafeEntity {
  idx: number;
  address: string;
  name: string;
  time: Date;
  creator: string;
  owners: string[];
  confirmationsRequired: number;
}

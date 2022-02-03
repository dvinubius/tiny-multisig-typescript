import { BigNumber } from '@ethersproject/bignumber';
export interface MSTransactionModel {
  idx: number;
  owner: string;
  to: string;
  value: BigNumber;
  data: string;
  dateSubmitted: Date;
  executed: boolean;
  numConfirmations?: number;
  dateExecuted?: Date;
}

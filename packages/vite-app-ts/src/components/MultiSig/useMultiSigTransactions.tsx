import { useEventListener } from 'eth-hooks';
import { useState, useEffect } from 'react';
import { MSTransactionModel } from './models/ms-transaction.model';

export interface MultiSigTransactions {
  pending: MSTransactionModel[];
  executed: MSTransactionModel[];
}

export interface MultiSigTransactionsResult {
  initializing: boolean;
  transactions?: MultiSigTransactions;
}

export const useMultiSigTransactions = (multiSigVault: any): MultiSigTransactionsResult => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<MultiSigTransactions>();

  const [lastSubmittedTxs, setLastSubmittedTxs] = useState<MSTransactionModel[]>();
  const [lastExecutedTxs, setLastExecutedTxs] = useState<{ owner: string; idx: number; dateExecuted: Date }[]>();

  // like rxjs combinelatest
  const combineSubmittedAndExecuted = () => {
    if (!(lastSubmittedTxs && lastExecutedTxs)) return;

    const pending: MSTransactionModel[] = [];
    const executed: MSTransactionModel[] = [];

    lastSubmittedTxs.forEach((tx) => {
      const execIdx = lastExecutedTxs.findIndex((t) => t.idx === tx.idx);
      if (execIdx !== -1) {
        tx.executed = true;
        tx.dateExecuted = lastExecutedTxs[execIdx].dateExecuted;
        executed.push(tx);
      } else {
        // if execute event not here yet, treat as pending
        // tx.executed = false;
        pending.push(tx);
      }
    });

    setTransactions({
      pending,
      executed,
    });
    setInitializing(false);
  };
  const [updateNonce, setUpdateNonce] = useState<number>(0);
  useEffect(() => combineSubmittedAndExecuted(), [updateNonce]);

  const [submitTxEvents] = useEventListener(multiSigVault, 'SubmitTransaction', 0);
  useEffect(() => {
    if (!transactions || submitTxEvents.length !== transactions.pending.length + transactions.executed.length) {
      const submittedTxs: MSTransactionModel[] = submitTxEvents
        .map((event) => ({
          owner: event.args[0],
          idx: event.args[1].toNumber(),
          to: event.args[2],
          value: event.args[3],
          data: event.args[4],
          dateSubmitted: new Date(event.args[5].toNumber() * 1000),
          executed: false,
        }))
        .reverse();
      const txsDetailsPromises = submittedTxs.map((tx) => multiSigVault.getTransaction(tx.idx));
      Promise.all(txsDetailsPromises).then((txsDetails) => {
        submittedTxs.forEach((tx, idx) => {
          tx.executed = txsDetails[idx].executed;
          tx.numConfirmations = txsDetails[idx].numConfirmations.toNumber();
        });
        setLastSubmittedTxs(submittedTxs);
        setUpdateNonce(Math.random());
      });
    }
  }, [submitTxEvents]);

  const [executeTxEvents] = useEventListener(multiSigVault, 'ExecuteTransaction', 0);
  useEffect(() => {
    const executedTxs = executeTxEvents.map((event) => ({
      owner: event.args[0],
      idx: event.args[1].toNumber(),
      dateExecuted: new Date(event.args[2].toNumber() * 1000),
    }));
    setLastExecutedTxs(executedTxs);
    setUpdateNonce(Math.random());
  }, [executeTxEvents]);

  return { initializing, transactions };
};

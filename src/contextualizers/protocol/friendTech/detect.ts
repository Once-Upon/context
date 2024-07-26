import { grabLogsFromTransaction } from '../../../helpers/utils';
import { Transaction } from '../../../types';
import { FRIEND_TECH_ADDRESSES } from './constants';

export const detect = (transaction: Transaction): boolean => {
  const logs = grabLogsFromTransaction(transaction);
  /** implement your detection logic */
  if (transaction.to !== FRIEND_TECH_ADDRESSES || logs.length === 0) {
    return false;
  }
  // buyShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0x6945b123') {
    return true;
  }

  // sellShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0xb51d0534') {
    return true;
  }

  return false;
};

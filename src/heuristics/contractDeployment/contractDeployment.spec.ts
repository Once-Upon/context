import { Transaction } from '../../types';
import { detectContractDeployment } from './contractDeployment';
import contractDeployed0x88e7d866 from '../../test/transactions/contractDeployed-0x88e7d866.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Contract Deployed', () => {
  it('Should detect contract deployment transaction', () => {
    const contractDeployed1 = detectContractDeployment(
      contractDeployed0x88e7d866 as Transaction,
    );
    expect(contractDeployed1).toBe(true);
  });

  it('Should not detect as contract deployment', () => {
    const notContractDeployed1 = detectContractDeployment(
      catchall0xc35c01ac as Transaction,
    );
    expect(notContractDeployed1).toBe(false);
  });
});

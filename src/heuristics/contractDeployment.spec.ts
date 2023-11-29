import { Transaction } from '../types';
import { detectContractDeployment } from './contractDeployment';
import contractDeployed0x88e7d866 from '../test-data/transactions/contractDeployed-0x88e7d866.json';

describe('Contract Deployed', () => {
  it('Should detect contract deployment transaction', () => {
    const contractDeployed1 = detectContractDeployment(
      contractDeployed0x88e7d866 as Transaction,
    );
    expect(contractDeployed1).toBe(true);
  });
});

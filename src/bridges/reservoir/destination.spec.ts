import { Transaction } from '../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../helpers/utils';
import bridgeZoraEnergyDestination0x7e7843df from '../../test/transactions/bridgeZoraEnergyDestination-0x7e7843df.json';
import hopDestination0x0902ccb6 from '../../test/transactions/hop-destination-0x0902ccb6.json';

describe('Bridge Zora Energy Destination', () => {
  it('Should detect transaction', () => {
    const isBridgeZoraEnergyDestination1 = detect(
      bridgeZoraEnergyDestination0x7e7843df as Transaction,
    );
    expect(isBridgeZoraEnergyDestination1).toBe(true);

    const isBridgeZoraEnergyDestination2 = detect(
      hopDestination0x0902ccb6 as Transaction,
    );
    expect(isBridgeZoraEnergyDestination2).toBe(false);
  });

  it('Should generate context', () => {
    const transaction = generate(
      bridgeZoraEnergyDestination0x7e7843df as Transaction,
    );
    expect(transaction.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BRIDGED 0.02 ETH from 1',
    );
    expect(containsBigInt(transaction.context)).toBe(false);
  });
});

import { Transaction } from '../../types';
import { detect, generate } from './source';
import { containsBigInt, contextSummary } from '../../helpers/utils';
import bridgeZoraEnergySource0x72084c64 from '../../test/transactions/bridgeZoraEnergySource-0x72084c64.json';
import hopSource0x8603ffab from '../../test/transactions/hop-source-0x8603ffab.json';

describe('Bridge Zora Energy Source', () => {
  it('Should detect transaction', () => {
    const isBridgeZoraEnergySource1 = detect(
      bridgeZoraEnergySource0x72084c64 as Transaction,
    );
    expect(isBridgeZoraEnergySource1).toBe(true);

    const isBridgeZoraEnergySource2 = detect(
      hopSource0x8603ffab as Transaction,
    );
    expect(isBridgeZoraEnergySource2).toBe(false);
  });

  it('Should generate context', () => {
    const transaction = generate(
      bridgeZoraEnergySource0x72084c64 as Transaction,
    );
    expect(transaction.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BRIDGED 0.020210725986515996 ETH to 7777777',
    );
    expect(containsBigInt(transaction.context)).toBe(false);
  });
});

import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import bridgeZoraEnergyDestination0x7e7843df from '../../test/transactions/bridgeZoraEnergyDestination-0x7e7843df.json';
import bridgeZoraEnergyDestination0x1edd564e from '../../test/transactions/bridgeZoraEnergyDestination-0x1edd564e.json';
import bridgeZoraEnergyDestination0xf178e44b from '../../test/transactions/bridgeZoraEnergyDestination-0xf178e44b.json';
import hopDestination0x0902ccb6 from '../../test/transactions/hop-destination-0x0902ccb6.json';

describe('Bridge Zora Energy Destination', () => {
  it('Should detect transaction', () => {
    const isBridgeZoraEnergyDestination1 = detect(
      bridgeZoraEnergyDestination0x7e7843df as unknown as Transaction,
    );
    expect(isBridgeZoraEnergyDestination1).toBe(true);

    const isBridgeZoraEnergyDestination2 = detect(
      hopDestination0x0902ccb6 as unknown as Transaction,
    );
    expect(isBridgeZoraEnergyDestination2).toBe(false);

    const isBridgeZoraEnergyDestination3 = detect(
      bridgeZoraEnergyDestination0x1edd564e as unknown as Transaction,
    );
    expect(isBridgeZoraEnergyDestination3).toBe(true);

    const isBridgeZoraEnergyDestination4 = detect(
      bridgeZoraEnergyDestination0xf178e44b as unknown as Transaction,
    );
    expect(isBridgeZoraEnergyDestination4).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      bridgeZoraEnergyDestination0x7e7843df as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 COMPLETED_A_CROSS_CHAIN_INTERACTION via 0xf70da97812cb96acdf810712aa562db8dfa3dbef and 0.02 ETH was transferred',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      bridgeZoraEnergyDestination0x1edd564e as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0xc761b876e04afa1a67c76bfd8c2c7aa5a5e8e35f COMPLETED_A_CROSS_CHAIN_INTERACTION via 0xf70da97812cb96acdf810712aa562db8dfa3dbef and 0.26754098684670663 ETH was transferred',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);

    const transaction3 = generate(
      bridgeZoraEnergyDestination0xf178e44b as unknown as Transaction,
    );
    expect(transaction3.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction3.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 COMPLETED_A_CROSS_CHAIN_INTERACTION via 0xf70da97812cb96acdf810712aa562db8dfa3dbef and 19692312680620439907443 0x4ed4e862860bed51a9570b96d89af5e1b0efefed was transferred',
    );
    expect(containsBigInt(transaction3.context)).toBe(false);
  });
});

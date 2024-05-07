import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import bridgeZoraEnergySource0x72084c64 from '../../test/transactions/bridgeZoraEnergySource-0x72084c64.json';
import zoraSource0xf2e656b3 from '../../test/transactions/zoraSource-0xf2e656b3.json';
import hopSource0x8603ffab from '../../test/transactions/hop-source-0x8603ffab.json';
import reservoirSource0x35c5ac27 from '../../test/transactions/reservoirSource-0x35c5ac27.json';

describe('Bridge Zora Energy Source', () => {
  it('Should detect transaction', () => {
    const isBridgeZoraEnergySource1 = detect(
      bridgeZoraEnergySource0x72084c64 as unknown as Transaction,
    );
    expect(isBridgeZoraEnergySource1).toBe(true);

    const isBridgeZoraEnergySource2 = detect(
      hopSource0x8603ffab as unknown as Transaction,
    );
    expect(isBridgeZoraEnergySource2).toBe(false);

    const isBridgeZoraEnergySource3 = detect(
      zoraSource0xf2e656b3 as unknown as Transaction,
    );
    expect(isBridgeZoraEnergySource3).toBe(true);

    const isBridgeZoraEnergySource4 = detect(
      reservoirSource0x35c5ac27 as unknown as Transaction,
    );
    expect(isBridgeZoraEnergySource4).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      bridgeZoraEnergySource0x72084c64 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 INITIATED_A_CROSS_CHAIN_INTERACTION via 0xf70da97812cb96acdf810712aa562db8dfa3dbef and 0.020210725986515996 ETH was transferred',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      zoraSource0xf2e656b3 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x17cd072cbd45031efc21da538c783e0ed3b25dcc INITIATED_A_CROSS_CHAIN_INTERACTION via 0xf70da97812cb96acdf810712aa562db8dfa3dbef and 3.829842894866116 ETH was transferred',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);

    const transaction3 = generate(
      reservoirSource0x35c5ac27 as unknown as Transaction,
    );
    expect(transaction3.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction3.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 INITIATED_A_CROSS_CHAIN_INTERACTION via 0xf70da97812cb96acdf810712aa562db8dfa3dbef and 0.201463549452958 ETH was transferred',
    );
    expect(containsBigInt(transaction3.context)).toBe(false);
  });
});

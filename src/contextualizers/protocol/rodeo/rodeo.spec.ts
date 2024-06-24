import { Transaction } from '../../../types';
import { detect, generate } from './rodeo';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import rodeo0x3c346a6d from '../../test/transactions/rodeo-0x3c346a6d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Rodeo Mint', () => {
  it('Should detect rodeo mint with rewards transaction', () => {
    const rodeo1 = detect(rodeo0x3c346a6d as unknown as Transaction);
    expect(rodeo1).toBe(true);
  });

  it('Should generate context for mintWithRewards transaction', () => {
    const rodeo1 = generate(rodeo0x3c346a6d as unknown as Transaction);
    expect(rodeo1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(rodeo1.context?.summaries?.en.title).toBe('Rodeo');
    const desc1 = contextSummary(rodeo1.context);
    expect(desc1).toBe(
      '0x5507dbd48a5a5bace8a6030e878cc4e0af147c33 MINTED 1 0x5ad72a748e30b92fa2e81f6d5f447aefbec5c644 #116263 for 0.0008 ETH with 0.0002 ETH in rewards for 0xdc0753f6b3cc6034317b73c10413c19958d36ed1',
    );
    expect(containsBigInt(rodeo1.context)).toBe(false);
  });

  it('Should not detect as zora creator', () => {
    const zoraMintWithRewards1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(zoraMintWithRewards1).toBe(false);
  });

  it('Should have protocol-specific context action', () => {
    const rodeo1 = detect(rodeo0x3c346a6d as unknown as Transaction);
    expect(rodeo1).toBe(true);

    const contextualized = generate(rodeo0x3c346a6d as unknown as Transaction);
    expect(contextualized['contextActions']).toContain('RODEO.MINTED');
  });
});

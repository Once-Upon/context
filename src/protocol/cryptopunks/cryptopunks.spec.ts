import { Transaction } from '../../types';
import { detect, generate } from './cryptopunks';
import cryptopunks0x3f68294b from '../../test/transactions/cryptopunks-0x3f68294b.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Cryptopunks', () => {
  it('Should detect cryptopunks', () => {
    const cryptopunks1 = detect(cryptopunks0x3f68294b as Transaction);
    expect(cryptopunks1).toBe(true);
  });

  it('Should generate context for cryptopunks', () => {
    const cryptopunks1 = generate(cryptopunks0x3f68294b as Transaction);
    expect(cryptopunks1.context.summaries.category).toBe('PROTOCOL_1');
    expect(cryptopunks1.context.summaries.en.title).toBe('Enter Bid for Punk');
    const desc1 = contextSummary(cryptopunks1.context);
    expect(desc1).toBe(
      '0x1919db36ca2fa2e15f9000fd9cdc2edcf863e685 BID_ON_PUNK 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb #5621 for 60.0 ETH',
    );
  });

  it('Should not detect as cryptopunks', () => {
    const cryptopunks1 = detect(catchall0xc35c01ac as Transaction);
    expect(cryptopunks1).toBe(false);
  });
});

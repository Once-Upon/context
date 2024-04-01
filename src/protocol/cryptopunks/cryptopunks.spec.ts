import { Transaction } from '../../types';
import { detect, generate } from './cryptopunks';
import cryptopunks0x3f68294b from '../../test/transactions/cryptopunks-0x3f68294b.json';
import cryptopunks0xd0d8cbaa from '../../test/transactions/cryptopunks-0xd0d8cbaa.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Cryptopunks', () => {
  it('Should detect cryptopunks', () => {
    const cryptopunks1 = detect(
      cryptopunks0x3f68294b as unknown as Transaction,
    );
    expect(cryptopunks1).toBe(true);

    const cryptopunks2 = detect(cryptopunks0xd0d8cbaa as Transaction);
    expect(cryptopunks2).toBe(true);
  });

  it('Should generate context for cryptopunks', () => {
    const cryptopunks1 = generate(
      cryptopunks0x3f68294b as unknown as Transaction,
    );
    expect(cryptopunks1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(cryptopunks1.context?.summaries?.en.title).toBe('CryptoPunks');
    const desc1 = contextSummary(cryptopunks1.context);
    expect(desc1).toBe(
      '0x1919db36ca2fa2e15f9000fd9cdc2edcf863e685 BID_ON_PUNK 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb #5621 for 60 ETH',
    );

    const cryptopunks2 = generate(cryptopunks0xd0d8cbaa as Transaction);
    expect(cryptopunks2.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(cryptopunks2.context?.summaries?.en.title).toBe('CryptoPunks');
    const desc2 = contextSummary(cryptopunks2.context);
    expect(desc2).toBe(
      '0x93b6af9f6fd83cf2a6a22a7ef529ff65f4724f17 BOUGHT_PUNK 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb #8515 from 0x0232d1083e970f0c78f56202b9a666b526fa379f for 156.9 ETH',
    );
  });

  it('Should not detect as cryptopunks', () => {
    const cryptopunks1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(cryptopunks1).toBe(false);
  });
});

import { Transaction } from '../../types';
import { detect, generate } from './enjoy';
import enjoyAddLiquidity0x5005b386 from '../../test/transactions/enjoyAddLiquidity-0x5005b386.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Enjoy', () => {
  it('Should detect enjoy', () => {
    const enjoy1 = detect(enjoyAddLiquidity0x5005b386 as Transaction);
    expect(enjoy1).toBe(true);
  });

  it('Should generate context for enjoy add liquidity', () => {
    const enjoy1 = generate(enjoyAddLiquidity0x5005b386 as Transaction);
    expect(enjoy1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(enjoy1.context?.summaries?.en.title).toBe('CryptoPunks');
    const desc1 = contextSummary(enjoy1.context);
    expect(desc1).toBe(
      '0x1919db36ca2fa2e15f9000fd9cdc2edcf863e685 BID_ON_PUNK 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb #5621 for 60 ETH',
    );
  });

  it('Should not detect as enjoy', () => {
    const enjoy1 = detect(catchall0xc35c01ac as Transaction);
    expect(enjoy1).toBe(false);
  });
});

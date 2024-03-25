import { Transaction } from '../../../types';
import { detect, generate } from './tokenTransfer';
import tokenTransfer0xcfba5dee from '../../test/transactions/tokenTransfer-0xcfba5dee.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Token Transfer', () => {
  it('Should detect token transfer transaction', () => {
    const tokenMint1 = detect(tokenTransfer0xcfba5dee as Transaction);
    expect(tokenMint1).toBe(true);
  });

  it('Should not detect token transfer transaction', () => {
    const tokenMint1 = detect(catchall0xc35c01ac as Transaction);
    expect(tokenMint1).toBe(false);
  });

  it('Should detect token transfer context', () => {
    const txResult1 = generate(tokenTransfer0xcfba5dee as Transaction);
    expect(txResult1.context?.variables?.sender['value']).toEqual(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20',
    );
    expect(txResult1.context?.variables?.token['token']).toEqual(
      '0x942bc2d3e7a589fe5bd4a5c6ef9727dfd82f5c8a',
    );
    expect(txResult1.context?.variables?.recipient['value']).toEqual(
      '0xb8edb17cd08dd854dee002f898b4f7cb3763ce75',
    );
  });
});

import { Transaction } from '../../../types';
import { detect, generate } from './boombox';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import boombox0x460925a4 from '../../test/transactions/boombox-0x460925a4.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Boombox', () => {
  it('Should detect transaction', () => {
    const isBoombox = detect(boombox0x460925a4 as unknown as Transaction);
    expect(isBoombox).toBe(true);
  });

  it('Should generate context', () => {
    const transaction = generate(boombox0x460925a4 as unknown as Transaction);
    expect(transaction.context?.summaries?.en.title).toBe('Boombox');
    expect(transaction.context?.variables?.artist['link']).toBe(
      'https://open.spotify.com/artist/1TdIV4gSwfVNsd4EMn7R99',
    );
    expect(transaction.context?.variables?.cost['value']?.[3]).toBe('60000000');
    expect(contextSummary(transaction.context)).toBe(
      '0xab18fdc21c33c3c60bbca753997a657f00d43f9e ADDED 1TdIV4gSwfVNsd4EMn7R99 on Spotify',
    );
    expect(containsBigInt(transaction.context)).toBe(false);
  });

  it('Should not detect transaction', () => {
    const match = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(match).toBe(false);
  });
});

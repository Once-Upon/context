import { Transaction } from '../../../types';
import { detect, generate } from './boombox';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import boombox0x460925a4 from '../../test/transactions/boombox-0x460925a4.json';
import boombox0xde83b70f from '../../test/transactions/boombox-0xde83b70f.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Boombox', () => {
  it('Should detect transaction', () => {
    const isBoombox1 = detect(boombox0x460925a4 as unknown as Transaction);
    expect(isBoombox1).toBe(true);

    const isBoombox2 = detect(boombox0xde83b70f as unknown as Transaction);
    expect(isBoombox2).toBe(true);
  });

  it('Should generate context', () => {
    const boombox1 = generate(boombox0x460925a4 as unknown as Transaction);
    expect(boombox1.context?.summaries?.en.title).toBe('Boombox');
    expect(boombox1.context?.variables?.artist['link']).toBe(
      'https://open.spotify.com/artist/1TdIV4gSwfVNsd4EMn7R99',
    );
    expect(boombox1.context?.variables?.cost['value']?.[3]).toBe('60000000');
    expect(contextSummary(boombox1.context)).toBe(
      '0xab18fdc21c33c3c60bbca753997a657f00d43f9e ADDED 1TdIV4gSwfVNsd4EMn7R99 on Spotify',
    );
    expect(containsBigInt(boombox1.context)).toBe(false);

    const boombox2 = generate(boombox0xde83b70f as unknown as Transaction);
    expect(boombox2.context?.summaries?.en.title).toBe('Boombox');
    expect(boombox2.context?.variables?.artist['link']).toBe(
      'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    );
    expect(boombox2.context?.variables?.points['value']).toBe('100000000');
    expect(contextSummary(boombox2.context)).toBe(
      '0x59F34a706AD87eb353Dd73fb1F50eBD3b2F18751 SIGNED 06HL4z0CvFAxyc27GXpf02',
    );
    expect(containsBigInt(boombox2.context)).toBe(false);
  });

  it('Should not detect transaction', () => {
    const match = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(match).toBe(false);
  });
});

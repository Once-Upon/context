import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldDestination0x85058886 from '../../test/transactions/goldDestination-0x85058886.json';
import goldDestination0x469f8c9c from '../../test/transactions/goldDestination-0x469f8c9c.json';

describe('Gold Destination', () => {
  it('Should detect transaction', () => {
    const isGoldDestination1 = detect(
      goldDestination0x85058886 as unknown as Transaction,
    );
    expect(isGoldDestination1).toBe(true);

    const isGoldDestination2 = detect(
      goldDestination0x469f8c9c as unknown as Transaction,
    );
    expect(isGoldDestination2).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      goldDestination0x85058886 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Gold');
    expect(contextSummary(transaction1.context)).toBe(
      '0xB374FDD2951A65e827Dab88f692a6819dc43c6D7 RECEIVED plots #0,#1 , 81 amount of zMOONGRASS and 912670 amount of Sky Gold',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      goldDestination0x469f8c9c as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Gold');
    expect(contextSummary(transaction2.context)).toBe(
      '0x18F33CEf45817C428d98C4E188A770191fDD4B79 RECEIVED plots #2,#3 , 9 amount of zEARTHMELON and 202816 amount of Sky Gold',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

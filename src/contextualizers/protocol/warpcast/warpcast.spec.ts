import { Transaction } from '../../../types';
import { detect, generate } from './warpcast';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import warpcast0xe33e439d from '../../test/transactions/warpcast-0xe33e439d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Warpcast', () => {
  it('Should detect warpcast transactions', () => {
    const warpcast1 = detect(warpcast0xe33e439d as unknown as Transaction);
    expect(warpcast1).toBe(true);
  });

  it('Should generate context for warpcast', () => {
    const swap1 = generate(warpcast0xe33e439d as unknown as Transaction);
    expect(swap1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(swap1.context?.summaries?.en.title).toBe('Farcaster');
    const desc1 = contextSummary(swap1.context);
    expect(desc1).toBe(
      '0xd7029bdea1c17493893aafe29aad69ef892b8ff2 BOUGHT 100000000 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913 of Warps for 0.044283738083525655',
    );
    expect(containsBigInt(swap1.context)).toBe(false);
  });

  it('Should not detect as UniswapV3', () => {
    const catchall1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(catchall1).toBe(false);
  });
});

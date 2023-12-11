import { Transaction } from '../../types';
import { detect, generate } from './weth';
import { contextSummary } from '../../helpers/utils';
import weth0x8ae756d0 from '../../test/transactions/weth-0x8ae756d0.json';
import weth0x0917947d from '../../test/transactions/weth-0x0917947d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Weth', () => {
  it('Should detect weth', () => {
    const weth1 = detect(weth0x8ae756d0 as Transaction);
    expect(weth1).toBe(true);

    const weth2 = detect(weth0x0917947d as Transaction);
    expect(weth2).toBe(true);
  });

  it('Should not detect as weth', () => {
    const weth1 = detect(catchall0xc35c01ac as Transaction);
    expect(weth1).toBe(false);
  });

  it('should generate weth context', () => {
    const weth1 = generate(weth0x8ae756d0 as Transaction);
    expect(weth1.context.summaries.en.title).toBe('WETH');
    expect(weth1.context.variables.wrapped).toBeDefined();
    expect(weth1.context.variables.wrapped.type).toBe('contextAction');
    expect(weth1.context.variables.wrapped.value).toBe('WRAPPED');

    const weth2 = generate(weth0x0917947d as Transaction);
    expect(weth2.context.summaries.en.title).toBe('WETH');
    expect(weth2.context.variables.unwrapped).toBeDefined();
    expect(weth2.context.variables.unwrapped.type).toBe('contextAction');
    expect(weth2.context.variables.unwrapped.value).toBe('UNWRAPPED');
    const wethDesc2 = contextSummary(weth2.context);
    expect(wethDesc2).toBe(
      '0x223a1b8d6f2ef8d83e0df91542b99601bc558e2c UNWRAPPED 0.05 ETH',
    );
  });
});

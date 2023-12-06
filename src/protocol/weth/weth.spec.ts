import { Transaction } from '../../types';
import { detectWeth, generateWethContext } from './weth';
import { contextSummary } from '../../helpers/utils';
import weth0x8ae756d0 from '../../test/transactions/weth-0x8ae756d0.json';
import weth0x0917947d from '../../test/transactions/weth-0x0917947d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Weth', () => {
  it('Should detect weth', () => {
    const weth1 = detectWeth(weth0x8ae756d0 as Transaction);
    expect(weth1).toBe(true);

    const weth2 = detectWeth(weth0x0917947d as Transaction);
    expect(weth2).toBe(true);
  });

  it('Should not detect as weth', () => {
    const weth1 = detectWeth(catchall0xc35c01ac as Transaction);
    expect(weth1).toBe(false);
  });

  it('should generate weth context', () => {
    const weth1 = generateWethContext(weth0x8ae756d0 as Transaction);
    expect(weth1.context.summaries.en.title).toBe('WETH');
    expect(weth1.context.summaries.en.variables.wrapped).toBeDefined();
    expect(weth1.context.summaries.en.variables.wrapped.type).toBe(
      'contextAction',
    );
    expect(weth1.context.summaries.en.variables.wrapped.value).toBe('wrapped');

    const weth2 = generateWethContext(weth0x0917947d as Transaction);
    expect(weth2.context.summaries.en.title).toBe('WETH');
    expect(weth2.context.summaries.en.variables.unwrapped).toBeDefined();
    expect(weth2.context.summaries.en.variables.unwrapped.type).toBe(
      'contextAction',
    );
    expect(weth2.context.summaries.en.variables.unwrapped.value).toBe(
      'unwrapped',
    );
    const wethDesc2 = contextSummary(weth2.context);
    expect(wethDesc2).toBe(
      '0x223a1b8d6f2ef8d83e0df91542b99601bc558e2c unwrapped 0.05 ETH',
    );
  });
});

import { Transaction } from '../../types';
import { detect, generate } from './erc20Swap';
import erc20Swap0x8cb66698 from '../../test/transactions/erc20Swap-0x8cb66698.json';
import erc20SwapNot0xb376ca2f from '../../test/transactions/erc20Swap-not-0xb376ca2f.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import erc20Swap0x6ef80cce from '../../test/transactions/erc20Swap-0x6ef80cce.json';
import erc20Swap0xfdad8f4c from '../../test/transactions/erc20Swap-0xfdad8f4c.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC20 Swap', () => {
  it('Should detect ERC20 Swap transaction', () => {
    const isERC20Swap = detect(erc20Swap0x8cb66698 as Transaction);
    expect(isERC20Swap).toBe(true);

    const isERC20Swap1 = detect(erc20Swap0xd55dc9b2 as Transaction);
    expect(isERC20Swap1).toBe(true);

    const isERC20Swap2 = detect(erc20Swap0x6ef80cce as Transaction);
    expect(isERC20Swap2).toBe(true);

    const isERC20Swap3 = detect(erc20Swap0xfdad8f4c as Transaction);
    expect(isERC20Swap3).toBe(true);
  });

  it('should generate ERC20 Swap context', () => {
    const erc20Swap3 = generate(erc20Swap0xfdad8f4c as Transaction);
    expect(erc20Swap3.context?.summaries.en.title).toBe('ERC20 Swap');
  });

  it('Should not detect as ERC20 Swap transaction', () => {
    const isERC20Swap1 = detect(erc20SwapNot0xb376ca2f as Transaction);
    expect(isERC20Swap1).toBe(false);

    const isERC20Swap2 = detect(catchall0xc35c01ac as Transaction);
    expect(isERC20Swap2).toBe(false);
  });
});

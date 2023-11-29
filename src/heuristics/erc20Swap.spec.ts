import { Transaction } from '../types';
import { detectERC20Swap } from './erc20Swap';
import erc20Swap0x8cb66698 from '../test-data/transactions/erc20Swap-0x8cb66698.json';
import erc20SwapNot0xb376ca2f from '../test-data/transactions/erc20Swap-not-0xb376ca2f.json';
import erc20Swap0xd55dc9b2 from '../test-data/transactions/erc20Swap-0xd55dc9b2.json';

describe('ERC20 Swap', () => {
  it('Should detect ERC20 Swap transaction', () => {
    const isERC20Swap = detectERC20Swap(erc20Swap0x8cb66698 as Transaction);
    expect(isERC20Swap).toBe(true);

    const isERC20Swap1 = detectERC20Swap(erc20Swap0xd55dc9b2 as Transaction);
    expect(isERC20Swap1).toBe(true);
  });

  it('Should not detect as ERC20 Swap transaction', () => {
    const isERC20Swap = detectERC20Swap(erc20SwapNot0xb376ca2f as Transaction);

    expect(isERC20Swap).toBe(false);
  });
});

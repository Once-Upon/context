import { Transaction } from '../../types';
import { contextSummary } from '../../helpers/utils';
import { detect, generate } from './erc20Swap';
import erc20Swap0x8cb66698 from '../../test/transactions/erc20Swap-0x8cb66698.json';
import erc20SwapNot0xb376ca2f from '../../test/transactions/erc20Swap-not-0xb376ca2f.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import erc20Swap0x6ef80cce from '../../test/transactions/erc20Swap-0x6ef80cce.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC20 Swap', () => {
  it('Should detect ERC20 Swap transaction', () => {
    const isERC20Swap = detect(erc20Swap0x8cb66698 as Transaction);
    expect(isERC20Swap).toBe(true);

    const isERC20Swap1 = detect(erc20Swap0xd55dc9b2 as Transaction);
    expect(isERC20Swap1).toBe(true);

    const isERC20Swap2 = detect(erc20Swap0x6ef80cce as Transaction);
    expect(isERC20Swap2).toBe(true);
  });

  it('Should generate context', () => {
    const generated = generate(erc20Swap0x8cb66698 as Transaction);
    const desc = contextSummary(generated.context);
    expect(desc).toBe(
      '0x6ead9b2a898bdee578dcbb931ec0c796b146604f SWAPPED 0.3 ETH for 93231394532841 0x6a36481af18289f80af4a1b21e4f6d323fabc712',
    );

    const generated1 = generate(erc20Swap0xd55dc9b2 as Transaction);
    const desc1 = contextSummary(generated1.context);
    expect(desc1).toBe(
      '0x15cce5a86dbec5bca10267f93043b3fe8c8e53bf SWAPPED 0.265516465497077765 ETH for 116282641519835232562 0x4d224452801aced8b2f0aebe155379bb5d594381',
    );

    const generated2 = generate(erc20Swap0x6ef80cce as Transaction);
    const desc2 = contextSummary(generated2.context);
    expect(desc2).toBe(
      '0x7b407335822f198511825ab166bd24ea705adca3 SWAPPED 4.3 ETH for 8975585548 0xdac17f958d2ee523a2206206994597c13d831ec7',
    );
  });

  it('Should not detect as ERC20 Swap transaction', () => {
    const isERC20Swap1 = detect(erc20SwapNot0xb376ca2f as Transaction);
    expect(isERC20Swap1).toBe(false);

    const isERC20Swap2 = detect(catchall0xc35c01ac as Transaction);
    expect(isERC20Swap2).toBe(false);
  });
});

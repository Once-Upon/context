import { Transaction } from '../../../types';
import { contextSummary } from '../../../helpers/utils';
import { detect, generate } from './erc20Swap';
import erc20Swap0x8cb66698 from '../../test/transactions/erc20Swap-0x8cb66698.json';
import erc20SwapNot0xb376ca2f from '../../test/transactions/erc20Swap-not-0xb376ca2f.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import erc20Swap0x6ef80cce from '../../test/transactions/erc20Swap-0x6ef80cce.json';
import erc20swap0x2c631258 from '../../test/transactions/erc20swap-0x2c631258.json';
import erc20Swap0x96f5e3fb from '../../test/transactions/erc20Swap-0x96f5e3fb.json';
import erc20Swap0x4d127476 from '../../test/transactions/erc20Swap-0x4d127476.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC20 Swap', () => {
  it('Should detect ERC20 Swap transaction', () => {
    const isERC20Swap = detect(erc20Swap0x8cb66698 as unknown as Transaction);
    expect(isERC20Swap).toBe(true);

    const isERC20Swap1 = detect(erc20Swap0xd55dc9b2 as unknown as Transaction);
    expect(isERC20Swap1).toBe(true);

    const isERC20Swap2 = detect(erc20Swap0x6ef80cce as unknown as Transaction);
    expect(isERC20Swap2).toBe(true);

    const isERC20Swap3 = detect(erc20swap0x2c631258 as unknown as Transaction);
    expect(isERC20Swap3).toBe(true);

    const isERC20Swap4 = detect(erc20Swap0x96f5e3fb as unknown as Transaction);
    expect(isERC20Swap4).toBe(true);

    const isERC20Swap5 = detect(erc20Swap0x4d127476 as unknown as Transaction);
    expect(isERC20Swap5).toBe(true);
  });

  it('Should generate context', () => {
    const generated = generate(erc20Swap0x8cb66698 as unknown as Transaction);
    const desc = contextSummary(generated.context);
    expect(desc).toBe(
      '0x6ead9b2a898bdee578dcbb931ec0c796b146604f SWAPPED 0.3 ETH for 93231394532841 0x6a36481af18289f80af4a1b21e4f6d323fabc712',
    );

    const generated1 = generate(erc20Swap0xd55dc9b2 as unknown as Transaction);
    const desc1 = contextSummary(generated1.context);
    expect(desc1).toBe(
      '0x15cce5a86dbec5bca10267f93043b3fe8c8e53bf SWAPPED 0.265516465497077765 ETH for 116282641519835232562 0x4d224452801aced8b2f0aebe155379bb5d594381',
    );

    const generated2 = generate(erc20Swap0x6ef80cce as unknown as Transaction);
    const desc2 = contextSummary(generated2.context);
    expect(desc2).toBe(
      '0x7b407335822f198511825ab166bd24ea705adca3 SWAPPED 4.3 ETH for 8975585548 0xdac17f958d2ee523a2206206994597c13d831ec7',
    );

    const generated3 = generate(erc20swap0x2c631258 as unknown as Transaction);
    const desc3 = contextSummary(generated3.context);
    expect(desc3).toBe(
      '0x6e947ba373a53bd41139d68e8dfb4fb0472767b6 SWAPPED 300000000000000000 0x4200000000000000000000000000000000000006 for 79907887473934231137403 0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    );

    const generated4 = generate(erc20Swap0x96f5e3fb as unknown as Transaction);
    const desc4 = contextSummary(generated4.context);
    expect(desc4).toBe(
      '0x605e05bf092ebd18e06d1b0f699df5b9dd85d452 SWAPPED 20398910132192029774490 0xeb1c32ea4e392346795aed3607f37646e2a9c13f for 2748.521373404267795478 ETH',
    );

    const generated5 = generate(erc20Swap0x4d127476 as unknown as Transaction);
    const desc5 = contextSummary(generated5.context);
    expect(desc5).toBe(
      '0x5507dbd48a5a5bace8a6030e878cc4e0af147c33 SWAPPED 0.029472790148424173 ETH for 600000000000000000000000 0xa6b280b42cb0b7c4a4f789ec6ccc3a7609a1bc39',
    );
  });

  it('Should not detect as ERC20 Swap transaction', () => {
    const isERC20Swap1 = detect(
      erc20SwapNot0xb376ca2f as unknown as Transaction,
    );
    expect(isERC20Swap1).toBe(false);

    const isERC20Swap2 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(isERC20Swap2).toBe(false);
  });
});

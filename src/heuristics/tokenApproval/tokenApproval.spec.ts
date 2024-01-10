import { Transaction } from '../../types';
import { detect, generate } from './tokenApproval';
import tokenApproval0x567130ba from '../../test/transactions/tokenApproval-0x567130ba.json';
import tokenApproval0x06f15d49 from '../../test/transactions/tokenApproval-0x06f15d49.json';
import tokenApproval0xa0c2a425 from '../../test/transactions/tokenApproval-0xa0c2a425.json';
import tokenApproval0x5336e8d2 from '../../test/transactions/tokenApproval-0x5336e8d2.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Token Approval', () => {
  it('Should detect token approval transaction', () => {
    const tokenApproval1 = detect(tokenApproval0x567130ba as Transaction);
    expect(tokenApproval1).toBe(true);

    const tokenApproval2 = detect(tokenApproval0x06f15d49 as Transaction);
    expect(tokenApproval2).toBe(true);

    const tokenApproval3 = detect(tokenApproval0xa0c2a425 as Transaction);
    expect(tokenApproval3).toBe(true);

    const tokenApproval4 = detect(tokenApproval0x5336e8d2 as Transaction);
    expect(tokenApproval4).toBe(true);
  });

  it('Should generate approval context', () => {
    const tokenApproval1 = generate(tokenApproval0x567130ba as Transaction);
    expect(tokenApproval1.context?.summaries?.en.title).toBe('Token Approval');
    const desc1 = contextSummary(tokenApproval1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 GAVE_ACCESS to 0x1e0049783f008a0085193e00003d00cd54003c71 for 0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    );

    const tokenApproval2 = generate(tokenApproval0x06f15d49 as Transaction);
    expect(tokenApproval2.context?.summaries?.en.title).toBe('Token Approval');
    const desc2 = contextSummary(tokenApproval2.context);
    expect(desc2).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 GAVE_ACCESS to 0x1e0049783f008a0085193e00003d00cd54003c71 for 0xd3605059c3ce9facf625fa72d727508b7b7f280f',
    );

    const tokenApproval3 = generate(tokenApproval0xa0c2a425 as Transaction);
    expect(tokenApproval3.context?.summaries?.en.title).toBe('Token Approval');
    const desc3 = contextSummary(tokenApproval3.context);
    expect(desc3).toBe(
      '0xb8edb17cd08dd854dee002f898b4f7cb3763ce75 GAVE_ACCESS to 0xdef1c0ded9bec7f1a1670819833240f027b25eff for 0x5283d291dbcf85356a21ba090e6db59121208b44',
    );

    const tokenApproval4 = generate(tokenApproval0x5336e8d2 as Transaction);
    expect(tokenApproval4.context?.summaries?.en.title).toBe('Token Approval');
    const desc4 = contextSummary(tokenApproval4.context);
    expect(desc4).toBe(
      '0x2294ae26bedf6960bfe3e668fa97a14ed756affc REVOKED_ACCESS from 0x13d8faf4a690f5ae52e2d2c52938d1167057b9af for 0x80336ad7a747236ef41f47ed2c7641828a480baa',
    );
  });

  it('Should not detect token approval transaction', () => {
    const tokenApproval1 = detect(catchall0xc35c01ac as Transaction);
    expect(tokenApproval1).toBe(false);
  });
});

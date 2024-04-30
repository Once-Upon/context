import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import degenDestination0x39dac307 from '../../test/transactions/degenDestination-0x39dac307.json';

describe('Degen Bridge Destination', () => {
  it('Should detect transaction', () => {
    const isDegenBridgeDestination1 = detect(
      degenDestination0x39dac307 as unknown as Transaction,
    );
    expect(isDegenBridgeDestination1).toBe(true);
  });

  it('Should generate context', () => {
    const transaction = generate(
      degenDestination0x39dac307 as unknown as Transaction,
    );
    expect(transaction.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction.context)).toBe(
      '0x888f05d02ea7b42f32f103c089c1750170830642 BRIDGED via 0x729170d38dd5449604f35f349fdfcc9ad08257cd and 470.99999367238779 ETH was transferred',
    );
    expect(containsBigInt(transaction.context)).toBe(false);
  });
});

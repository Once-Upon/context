import { transform } from './sigHash';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionSigHash', () => {
  it('should return transaction sigHash', () => {
    const block = loadBlockFixture('ethereum', 13142655);
    const result = transform(block);

    const txResult = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0x044b142b9ef202512e24f233fbc0b87033dfa772ed74aeebaad4a9a3ea41c38a',
    );
    expect(txResult).toBeDefined();
    if (txResult) {
      expect(txResult.sigHash).toBe('0xaf182255');
      expect(txResult.internalSigHashes).toStrictEqual([
        {
          from: '0x4cdf3d8b92fdde2fcdf7de29ee38fca4be90eed0',
          to: '0x2e956ed3d7337f4ed4316a6e8f2edf74bf84bb54',
          sigHash: '0xaf182255',
        },
        {
          from: '0x2e956ed3d7337f4ed4316a6e8f2edf74bf84bb54',
          to: '0x2252d401ec9d16065069529b053b105fe42e0176',
          sigHash: '0x70a08231',
        },
        {
          from: '0x2e956ed3d7337f4ed4316a6e8f2edf74bf84bb54',
          to: '0x2252d401ec9d16065069529b053b105fe42e0176',
          sigHash: '0x2f745c59',
        },
        {
          from: '0x2e956ed3d7337f4ed4316a6e8f2edf74bf84bb54',
          to: '0x2252d401ec9d16065069529b053b105fe42e0176',
          sigHash: '0x2f745c59',
        },
        {
          from: '0x2e956ed3d7337f4ed4316a6e8f2edf74bf84bb54',
          to: '0x2252d401ec9d16065069529b053b105fe42e0176',
          sigHash: '0x2f745c59',
        },
      ]);
    }
  });
});

import { transform } from './fees';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionFees', () => {
  it('should return transaction fees', () => {
    // first test pre-London hardfork
    const preLondonBlock = loadBlockFixture('ethereum', 12500000);
    const preResult = transform(preLondonBlock);
    const tx = preResult.transactions.find(
      (tx) =>
        tx.hash ===
        '0x4f874000175e15df5cd5ee482d0fbf72a59a752a9146530b94d219646a75464a',
    );
    expect(tx).toBeDefined();
    if (tx) {
      expect(tx.baseFeePerGas).toBe(preLondonBlock.baseFeePerGas);
      expect(tx.transactionFee).toBe('3741309000000000');
    }

    // and then test after
    const postLondonBlock = loadBlockFixture('ethereum', 14573289);
    const postResult = transform(postLondonBlock);
    for (const tx of postResult.transactions) {
      expect(tx.baseFeePerGas).toBe(postLondonBlock.baseFeePerGas);
    }
    const postTx = postResult.transactions.find(
      (tx) =>
        tx.hash ===
        '0x942e0ff43a8716ee324bef63c346a045839c44ccee15e49519726e6ba4ba3984',
    );
    expect(postTx).toBeDefined();
    if (postTx) {
      expect(postTx.transactionFee).toBe('4250851431844025');
    }

    // check totalL2FeeWei
    const block1 = loadBlockFixture('ethereum', 14573289);
    const result1 = transform(block1);
    for (const tx of result1.transactions) {
      expect(tx.transactionFee).toBeDefined();
    }
  });
});

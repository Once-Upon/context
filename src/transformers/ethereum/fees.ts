import type { RawBlock } from '../../types';
import { parseUnits } from 'viem';

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    let totalL2FeeWei = BigInt(0);
    if (tx.gasPrice) {
      const l2GasPrice = BigInt(tx.gasPrice ?? 0);
      const l2GasUsed = BigInt(tx.receipt.gasUsed ?? 0);

      const l2Gas = l2GasPrice * l2GasUsed;

      const l1GasUsed = BigInt(tx.receipt.l1GasUsed ?? 0);
      const l1GasPrice = BigInt(tx.receipt.l1GasPrice ?? 0);

      const l1GasWithoutScalar = l1GasPrice * l1GasUsed;

      const scalar = Number(tx.receipt.l1FeeScalar ?? 0);
      const l1GasWithoutScalarAsNumber = Number(l1GasWithoutScalar);
      const l1GasWithScalar = l1GasWithoutScalarAsNumber * scalar;

      totalL2FeeWei = parseUnits(l1GasWithScalar.toString(), 18) + l2Gas;
    }

    tx.baseFeePerGas = block.baseFeePerGas;
    tx.transactionFee = totalL2FeeWei.toString();

    return tx;
  });

  return block;
}

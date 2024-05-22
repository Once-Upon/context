import { getEventSelector } from 'viem';
import { transform as _transform } from './index';
import { makeTransform } from '../../../helpers/utils';
import { loadBlockFixture } from '../../../helpers/dev';
import { ENTRY_POINT_V060 } from './constants';
import { ERC20_TRANSFER_EVENT } from '../../../helpers/constants';

const transform = makeTransform({ test: _transform });

describe('erc4337userOps', () => {
  it('should unpack pseudotransactions', () => {
    const block = loadBlockFixture('ethereum', 19_298_068);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0x7a5e7d32380ae2ca3064b7fbc41e0d698cb7826f61a941737902f4a74a979ca7',
    );
    expect(txn).toBeDefined();

    expect(txn?.pseudotransactions).toBeDefined();
    expect(txn?.pseudotransactions?.length).toBe(1);

    const pseudoTransaction = txn!.pseudotransactions![0];

    expect(pseudoTransaction).toMatchObject({
      from: '0x2991c3845396c9f1d262b2ca0674111a59e2c90a',
      to: '0x5d72015cc621025c265fabffc2fa55ac4821d79f',
      receipt: expect.objectContaining({ status: 1 }),
    });
  });

  it('should set value for eth transfers', () => {
    const block = loadBlockFixture('ethereum', 19_298_068);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0x7a5e7d32380ae2ca3064b7fbc41e0d698cb7826f61a941737902f4a74a979ca7',
    );

    const pseudoTransaction = txn!.pseudotransactions![0];
    expect(pseudoTransaction).toMatchObject({
      from: '0x2991c3845396c9f1d262b2ca0674111a59e2c90a',
      to: '0x5d72015cc621025c265fabffc2fa55ac4821d79f',
      input: '0x',
      value: 5000000000000000n,
    });
  });

  it('should only include logs from user op', () => {
    const block = loadBlockFixture('ethereum', 19_560_565);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0xa8c9957193c0be795a1a032564728bda9bcea9899317b2e6298ec55ce19a689f',
    )!;

    // Check that the full transaction has logs from the entry point
    expect(txn.receipt).toMatchObject({
      logs: expect.arrayContaining([
        expect.objectContaining({
          address: ENTRY_POINT_V060,
        }),
      ]),
    });

    // Check that the pseudoTransaction does NOT have logs from the entry point
    const pseudoTransaction = txn.pseudotransactions![0];
    expect(pseudoTransaction.receipt).toMatchObject({
      logs: expect.not.arrayContaining([
        expect.objectContaining({
          address: ENTRY_POINT_V060,
        }),
      ]),
    });

    const ERC20_TRANSFER_EVENT_SIGNATURE = getEventSelector(ERC20_TRANSFER_EVENT[0]);

    // Check that the pseudoTransaction does include transfer log
    expect(pseudoTransaction.receipt).toMatchObject({
      logs: expect.arrayContaining([
        expect.objectContaining({
          topics: expect.arrayContaining([ERC20_TRANSFER_EVENT_SIGNATURE]),
        }),
      ]),
    });
  });

  it('should only include logs from one user op when multiple', () => {
    const block = loadBlockFixture('ethereum', 17_415_848);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0xc7d4c93fefb9f56383d9a9e4cbafa53696610b777ac5797f751652db928b9ad1',
    )!;

    expect(txn.pseudotransactions!.length).toBe(2);

    expect(txn.pseudotransactions![0].receipt.logs.length).toBe(1);
    expect(txn.pseudotransactions![1].receipt.logs.length).toBe(4);
  });

  it('should only include traces from user op', () => {
    const block = loadBlockFixture('ethereum', 19_560_565);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0xa8c9957193c0be795a1a032564728bda9bcea9899317b2e6298ec55ce19a689f',
    )!;

    const pseudoTxn = txn.pseudotransactions![0];

    expect(txn.traces.length > pseudoTxn.traces.length);
    expect(pseudoTxn.traces.map((v) => v.traceAddress)).toEqual([
      [1],
      [1, 0],
      [1, 0, 0],
      [1, 0, 0, 0],
    ]);
  });

  it('should only include traces from one user op when multiple', () => {
    const block = loadBlockFixture('ethereum', 17_415_848);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0xc7d4c93fefb9f56383d9a9e4cbafa53696610b777ac5797f751652db928b9ad1',
    )!;

    expect(
      txn.pseudotransactions![0].traces.map((v) => v.traceAddress),
    ).toEqual([[4], [4, 0], [4, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0, 0]]);

    expect(txn.pseudotransactions![1].traces.map((v) => v.traceAddress)).toEqual([
      [5],
      [5, 0],
      [5, 0, 0],
      [5, 0, 0, 0],
      [5, 0, 0, 0, 0],
      [5, 0, 0, 0, 1],
      [5, 0, 0, 0, 1, 0],
      [5, 0, 0, 0, 2],
      [5, 0, 0, 0, 2, 0],
      [5, 0, 0, 0, 2, 1],
      [5, 0, 0, 0, 2, 1, 0],
      [5, 0, 0, 0, 2, 2]
    ]);
  });

  it('should set receipt.status to 0 when a userOp failed', () => {
    const block = loadBlockFixture('ethereum', 19_575_404);
    const result = transform(block);

    const txn = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0x2f54574405fda5bedfa9d6df46188550033d3a18829f46456fa009199911b596',
    )!;

    const pseudoTxn = txn.pseudotransactions![0];

    expect(pseudoTxn.receipt.status).toBe(0);
  });
});

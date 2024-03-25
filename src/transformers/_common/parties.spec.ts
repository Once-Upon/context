import { transform } from './parties';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionParties', () => {
  it('should return transaction parties', () => {
    const block = loadBlockFixture('ethereum', '12679108_decoded');
    const result = transform(block);

    const txResult1 = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0xf677a8d48d456fc124b3097ccb7e35171b5f8c048f4682ae1566da828bca4480',
    );
    expect(txResult1).toBeDefined();
    if (txResult1) {
      expect(txResult1.parties).toStrictEqual([
        '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
        '0xfc1e1fd1d25d915c7eae1ece7112eb141dca540d',
        '0xa3c1e324ca1ce40db73ed6026c4a177f099b5770',
        '0xb2233fcec42c588ee71a594d9a25aa695345426c',
        '0xc0f874d652cd46ad233971fc61008309778730dd',
        '0x0000000000000000000000000000000000000000',
      ]);
    }

    const txResult2 = result.transactions.find(
      (tx) =>
        tx.hash ===
        '0x4e4959da92eae0e03e835c5c71e77fe58e8d1e0f9795e309d661fcc65abdc021',
    );
    expect(txResult2).toBeDefined();
    if (txResult2) {
      expect(txResult2.parties).toStrictEqual([
        '0xa6ae57b1da8238cd149bc718c40578e4620b752c',
        '0x00000000003b3cc22af3ae1eac0440bcee416b40',
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '0xa9bd7eef0c7affbdbdae92105712e9ff8b06ed49',
        '0x725c263e32c72ddc3a19bea12c5a0479a81ee688',
        '0x3421b1fb3f9e1bb232386ae055fa788ee0e01463',
        '0xb9f77c41becc96bfcf9dd75623a72dd92309e4a6',
        '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
        '0xc3d1eb891f24de439937c73748fc455588828489',
        '0xc52b39ab373c6c5dceb9b87658808f956dfd25fd',
      ]);
    }

    const block1 = loadBlockFixture('ethereum', '19314625_decoded');
    const result1 = transform(block1);

    const txResult3 = result1.transactions.find(
      (tx) =>
        tx.hash ===
        '0x3f72cddbe502dd7af1d946d8715c1166b62a19cf113d924375e9623783e3c27f',
    );
    expect(txResult3).toBeDefined();
    if (txResult3) {
      expect(txResult3.parties).toStrictEqual([
        '0x9696f59e4d72e237be84ffd425dcad154bf96976',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0x2906bdda4bde0338cf9af4370d5b838da4a0d08f',
        '0x1111111254eeb25477b68fb85ed929f73a960582',
        '0x54b50187becd0bbcfd52ec5d538433dab044d2a8',
      ]);
    }

    const txResult4 = result1.transactions.find(
      (tx) =>
        tx.hash ===
        '0xe408697db3e84a9287f563dafb8243c0e12ed604cc669a07157d40485d43226b',
    );
    expect(txResult4).toBeDefined();
    if (txResult4) {
      expect(txResult4.parties).toStrictEqual([
        '0xf074c1652d4ff936effe0087e7ce57c62aa7371d',
        '0xd1d2eb1b1e90b638588728b4130137d262c87cae',
        '0x8d92a6812b3da2346883f0631910c96cb9c5a5f9',
        '0x2906bdda4bde0338cf9af4370d5b838da4a0d08f',
        '0x1111111254eeb25477b68fb85ed929f73a960582',
        '0x54b50187becd0bbcfd52ec5d538433dab044d2a8',
      ]);
    }

    const block2 = loadBlockFixture('ethereum', '18965012_decoded');
    const result2 = transform(block2);

    expect(result2).toBeDefined();
  });
});

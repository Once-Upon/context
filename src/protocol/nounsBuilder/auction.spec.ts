import { Transaction } from '../../types';
import { containsBigInt, contextSummary } from '../../helpers/utils';
import { detect, generate } from './auction';

import easAttest0xfed2349f from '../../test/transactions/eas-attest-mainnet-0xfed2349f.json';
import nounsAuctionHouseBid0x4efdef57 from '../../test/transactions/nouns-auction-house-bid-0x4efdef57.json';
import nounsAuctionHouseSettleAndCreate0x354aea2d from '../../test/transactions/nouns-auction-house-settle-and-create-0x354aea2d.json';

import nounsBuilderAuctionPurpleCreateBid0x638faccc from '../../test/transactions/nouns-builder-auction-purple-create-bid-0x638faccc.json';
import nounsBuilderAuctionPurpleSettleAndCreate0xc35c01ac from '../../test/transactions/nouns-builder-auction-purple-settle-and-create-0xc35c01ac.json';

import nounsBuilderAuctionUnknownCreateBid0x401da075 from '../../test/transactions/nouns-builder-auction-unknown-create-bid-0x401da075.json';
import nounsBuilderAuctionUnknownSettleAndCreate0x4446c0b0 from '../../test/transactions/nouns-builder-auction-unknown-settle-and-create-0x4446c0b0.json';

describe('NounsBuilderDAO Auction', () => {
  describe('createBid', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderAuctionUnknownCreateBid0x401da075 as unknown as Transaction,
      );
      expect(unknown).toBe(true);

      const purple = detect(
        nounsBuilderAuctionPurpleCreateBid0x638faccc as unknown as Transaction,
      );
      expect(purple).toBe(true);
    });

    it('Should not detect', () => {
      // NOTE: the catchall we normally use is a settleCurrentAndCreateNewAuction
      // call for PurpleDAO
      const nouns1 = detect(
        nounsAuctionHouseBid0x4efdef57 as unknown as Transaction,
      );
      expect(nouns1).toBe(false);

      const other = detect(easAttest0xfed2349f as unknown as Transaction);
      expect(other).toBe(false);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderAuctionUnknownCreateBid0x401da075 as unknown as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0xad8717e33c719a9b407ad6b40d0be237845c2fbf BID 0.0001 ETH on token # 5',
      );
      expect(containsBigInt(unknown.context)).toBe(false);

      const purple = generate(
        nounsBuilderAuctionPurpleCreateBid0x638faccc as unknown as Transaction,
      );
      const purpleDesc = contextSummary(purple.context);
      expect(purpleDesc).toBe(
        '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BID 0.099 ETH on 0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60 #242',
      );
      expect(containsBigInt(purple.context)).toBe(false);
    });
  });

  describe('settleCurrentAndCreateNewAuction', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderAuctionUnknownSettleAndCreate0x4446c0b0 as unknown as Transaction,
      );
      expect(unknown).toBe(true);

      const purple = detect(
        nounsBuilderAuctionPurpleSettleAndCreate0xc35c01ac as unknown as Transaction,
      );
      expect(purple).toBe(true);
    });

    it('Should not detect', () => {
      // NOTE: the catchall we normally use is a settleCurrentAndCreateNewAuction
      // call for PurpleDAO
      const nouns1 = detect(
        nounsAuctionHouseSettleAndCreate0x354aea2d as unknown as Transaction,
      );
      expect(nouns1).toBe(false);

      const other = detect(easAttest0xfed2349f as unknown as Transaction);
      expect(other).toBe(false);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderAuctionUnknownSettleAndCreate0x4446c0b0 as unknown as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0xad8717e33c719a9b407ad6b40d0be237845c2fbf SETTLED auction for token # 4 won by 0x2767500a75D90D711b2Ac27b3a032a0dAa40e4B2',
      );
      expect(containsBigInt(unknown.context)).toBe(false);

      const purple = generate(
        nounsBuilderAuctionPurpleSettleAndCreate0xc35c01ac as unknown as Transaction,
      );
      const purpleDesc = contextSummary(purple.context);
      expect(purpleDesc).toBe(
        '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 SETTLED auction for 0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60 #242 won by 0x74B78e98093F5B522A7eBDAc3B994641cA7c2b20',
      );
      expect(containsBigInt(purple.context)).toBe(false);
    });
  });
});

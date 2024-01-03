import { Transaction } from '../../types';
import { contextSummary } from '../../helpers/utils';
import { detect, generate } from './auctionHouse';
import nounsAuctionHouseBid0x4efdef57 from '../../test/transactions/nouns-auction-house-bid-0x4efdef57.json';
import nounsAuctionHouseSettleAndCreate0x354aea2d from '../../test/transactions/nouns-auction-house-settle-and-create-0x354aea2d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Nouns Auction House', () => {
  describe('createBid', () => {
    it('Should detect transaction', () => {
      const nouns1 = detect(nounsAuctionHouseBid0x4efdef57 as Transaction);
      expect(nouns1).toBe(true);
    });

    it('Should not detect', () => {
      const nouns1 = detect(catchall0xc35c01ac as Transaction);
      expect(nouns1).toBe(false);
    });

    it('Should generate context', () => {
      const nouns1 = generate(nounsAuctionHouseBid0x4efdef57 as Transaction);
      const desc1 = contextSummary(nouns1.context);
      expect(desc1).toBe(
        '0xa86882277e69fbf0a51805cdc8b0a3a113079e63 BID 12 ETH on 0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03 #938',
      );
    });
  });

  describe('settleCurrentAndCreateNewAuction', () => {
    it('Should detect transaction', () => {
      const nouns1 = detect(
        nounsAuctionHouseSettleAndCreate0x354aea2d as Transaction,
      );
      expect(nouns1).toBe(true);
    });

    it('Should not detect', () => {
      const nouns1 = detect(catchall0xc35c01ac as Transaction);
      expect(nouns1).toBe(false);
    });

    it('Should generate context', () => {
      const nouns1 = generate(
        nounsAuctionHouseSettleAndCreate0x354aea2d as Transaction,
      );
      const desc1 = contextSummary(nouns1.context);
      expect(desc1).toBe(
        '0xca89e2472fe57bdc74f2361ceea5962fb205119c SETTLED auction for 0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03 #938 won by 0xA86882277E69FbF0a51805cdc8b0a3a113079E63',
      );
    });
  });
});

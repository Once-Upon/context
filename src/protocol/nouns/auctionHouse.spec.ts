import { Transaction } from '../../types';
import { contextSummary, containsBigInt } from '../../helpers/utils';
import { detect, generate } from './auctionHouse';
import nounsAuctionHouseBid0x4efdef57 from '../../test/transactions/nouns-auction-house-bid-0x4efdef57.json';
import nounsAuctionHouseSettleAndCreate0x354aea2d from '../../test/transactions/nouns-auction-house-settle-and-create-0x354aea2d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Nouns Auction House', () => {
  describe('createBid', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsAuctionHouseBid0x4efdef57 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsAuctionHouseBid0x4efdef57 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xa86882277e69fbf0a51805cdc8b0a3a113079e63 BID 12 ETH on 0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03 #938',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('settleCurrentAndCreateNewAuction', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsAuctionHouseSettleAndCreate0x354aea2d as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsAuctionHouseSettleAndCreate0x354aea2d as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xca89e2472fe57bdc74f2361ceea5962fb205119c SETTLED auction for 0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03 #938 won by 0xA86882277E69FbF0a51805cdc8b0a3a113079E63',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('Other transactions', () => {
    it('Should not detect', () => {
      const other = detect(catchall0xc35c01ac as unknown as Transaction);
      expect(other).toBe(false);
    });
  });
});

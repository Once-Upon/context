import boomBoxAbi from './abis/Boombox';

export const EVENT_DISTRIBUTE_TOPIC =
  '0xa2283f96c6cf6736105c157e7e65bcdcb93a7d00384d129da2c964566b17c9a0';
export const POINTS_ADDED_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'systemId',
        type: 'uint256',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        name: 'points',
        type: 'uint256',
      },
    ],
    name: 'PointsAdded',
    type: 'event',
  },
] as const;

export const BOOMBOX_ARTIST_SPOTIFY_LINK = 'https://open.spotify.com/artist';
export const BOOMBOX_ABI = boomBoxAbi;

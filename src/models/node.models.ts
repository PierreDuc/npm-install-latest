export const YesValues = [ 'yes', 'y' ];

export const NoValues = [ 'no', 'n' ];

export interface OutdatedPackage {
  current: string;
  wanted: string;
  latest: string;
  location: string;
}

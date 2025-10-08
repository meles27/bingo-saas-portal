export interface ListBingoCardEntity {
  id: string;
  name: string;
  serial: string;
  rows: number;
  cols: number;
  freespaceEnabled: boolean;
  layout: [number, number, number][];
}

export interface BingoCardQueryParamsIface {
  offset?: number;
  limit?: number;
  search?: string;
}

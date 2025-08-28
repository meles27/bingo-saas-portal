export interface PatternListEntity {
  id: string;
  name: string;
  type: 'static' | 'dynamic'; // Assuming type can be one of these
  description: string | null;
  coordinates: [number, number][];
}

export interface PatternDetailEntity extends PatternListEntity {
  createdAt: string;
  updatedAt: string;
}

export interface PatternQueryParamsType {
  offset: number;
  limit: number;
  search?: string;
  type?: 'static' | 'dynamic';
}

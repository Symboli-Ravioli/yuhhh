
export enum AlgorithmType {
  SORTING = 'sorting',
  SEARCHING = 'searching',
  GREEDY = 'greedy',
}

export enum SortingAlgorithm {
  BUBBLE = 'bubble',
  SELECTION = 'selection',
  INSERTION = 'insertion',
  MERGE = 'merge',
  QUICK = 'quick',
}

export enum SearchingAlgorithm {
  LINEAR = 'linear',
  BINARY = 'binary',
  JUMP = 'jump',
}

export enum GreedyAlgorithm {
  JOB_SEQUENCING = 'jobsequencing',
  KNAPSACK = 'knapsack',
}

export type Algorithm = SortingAlgorithm | SearchingAlgorithm | GreedyAlgorithm;

export interface Bar {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'found' | 'searching' | 'pivot';
}

export interface Job {
  id: string;
  profit: number;
  deadline: number;
  status?: 'default' | 'processing' | 'accepted' | 'rejected';
}

export interface KnapsackItem {
  id: string;
  value: number;
  weight: number;
  ratio: number;
  status?: 'default' | 'considering' | 'taken' | 'fraction_taken';
  fraction?: number;
}

export interface Stats {
  comparisons: number;
  swaps: number;
  profit?: number;
  weight?: number;
}

export interface AlgorithmInfo {
  name: string;
  description: string;
}

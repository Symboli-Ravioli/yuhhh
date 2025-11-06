
import { Algorithm, AlgorithmInfo, AlgorithmType, GreedyAlgorithm, SearchingAlgorithm, SortingAlgorithm } from './types';

export const ALGO_INFO: Record<Algorithm, AlgorithmInfo> = {
  [SortingAlgorithm.BUBBLE]: {
    name: "Bubble Sort",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in wrong order. Time: O(n²), Space: O(1)"
  },
  [SortingAlgorithm.SELECTION]: {
    name: "Selection Sort",
    description: "Divides array into sorted and unsorted regions, repeatedly selects the smallest element from unsorted region. Time: O(n²), Space: O(1)"
  },
  [SortingAlgorithm.INSERTION]: {
    name: "Insertion Sort",
    description: "Builds sorted array one item at a time by inserting elements into their correct position. Time: O(n²), Space: O(1)"
  },
  [SortingAlgorithm.MERGE]: {
    name: "Merge Sort",
    description: "Divide-and-conquer algorithm that divides array into halves, sorts them and merges back. Time: O(n log n), Space: O(n)"
  },
  [SortingAlgorithm.QUICK]: {
    name: "Quick Sort",
    description: "Picks a pivot element and partitions array around it, then recursively sorts sub-arrays. Time: O(n log n) avg, Space: O(log n)"
  },
  [SearchingAlgorithm.LINEAR]: {
    name: "Linear Search",
    description: "Sequentially checks each element until target is found or list ends. Time: O(n), Space: O(1)"
  },
  [SearchingAlgorithm.BINARY]: {
    name: "Binary Search",
    description: "Efficiently finds target in sorted array by repeatedly dividing search interval in half. Time: O(log n), Space: O(1)"
  },
  [SearchingAlgorithm.JUMP]: {
    name: "Jump Search",
    description: "Jumps ahead by fixed steps to find range, then linear searches within that range. Works on sorted arrays. Time: O(√n), Space: O(1)"
  },
  [GreedyAlgorithm.JOB_SEQUENCING]: {
    name: "Job Sequencing Problem",
    description: "Greedy algorithm to maximize profit by scheduling jobs with deadlines. Sorts jobs by profit and assigns to latest possible slot. Time: O(n²), Space: O(n)"
  },
  [GreedyAlgorithm.KNAPSACK]: {
      name: "Fractional Knapsack Problem",
      description: "Greedy algorithm to maximize value in a knapsack. Items with the highest value-to-weight ratio are selected first. Time: O(n log n), Space: O(n)"
  }
};

export const ALGORITHM_OPTIONS: Record<AlgorithmType, { value: Algorithm; label: string }[]> = {
  [AlgorithmType.SORTING]: [
    { value: SortingAlgorithm.BUBBLE, label: 'Bubble Sort' },
    { value: SortingAlgorithm.SELECTION, label: 'Selection Sort' },
    { value: SortingAlgorithm.INSERTION, label: 'Insertion Sort' },
    { value: SortingAlgorithm.MERGE, label: 'Merge Sort' },
    { value: SortingAlgorithm.QUICK, label: 'Quick Sort' },
  ],
  [AlgorithmType.SEARCHING]: [
    { value: SearchingAlgorithm.LINEAR, label: 'Linear Search' },
    { value: SearchingAlgorithm.BINARY, label: 'Binary Search' },
    { value: SearchingAlgorithm.JUMP, label: 'Jump Search' },
  ],
  [AlgorithmType.GREEDY]: [
    { value: GreedyAlgorithm.JOB_SEQUENCING, label: 'Job Sequencing' },
    { value: GreedyAlgorithm.KNAPSACK, label: 'Fractional Knapsack' },
  ],
};

export const DEFAULT_ARRAY_INPUT = '64, 34, 25, 12, 22, 11, 90';
export const DEFAULT_JOB_INPUT = '100,2;19,1;27,2;25,1;15,3';
export const DEFAULT_KNAPSACK_INPUT = '60,10;100,20;120,30';
export const DEFAULT_SPEED = 500;

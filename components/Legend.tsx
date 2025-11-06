
import React from 'react';
import { Algorithm, AlgorithmType, GreedyAlgorithm } from '../types';

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-5 rounded ${color}`}></div>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

interface LegendProps {
  type: AlgorithmType;
  algorithm: Algorithm;
}

export const Legend: React.FC<LegendProps> = ({ type, algorithm }) => {
  if (type === AlgorithmType.GREEDY) {
    if (algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
      return (
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
            <LegendItem color="bg-orange-100 border-2 border-orange-400" label="Processing" />
            <LegendItem color="bg-green-100 border-2 border-green-400" label="Accepted" />
            <LegendItem color="bg-red-100 border-2 border-red-400" label="Rejected" />
        </div>
      );
    }
    if (algorithm === GreedyAlgorithm.KNAPSACK) {
        return (
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
                <LegendItem color="bg-orange-100 border-2 border-orange-400" label="Considering" />
                <LegendItem color="bg-green-100 border-2 border-green-400" label="Taken (Whole)" />
                <LegendItem color="bg-teal-100 border-2 border-teal-400" label="Taken (Fraction)" />
            </div>
        );
    }
    return null;
  }

  return (
    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
      <LegendItem color="bg-gradient-to-t from-indigo-500 to-purple-600" label="Default" />
      <LegendItem color="bg-gradient-to-t from-yellow-400 to-orange-500" label="Comparing" />
      <LegendItem color="bg-gradient-to-t from-red-500 to-red-700" label="Swapping" />
      <LegendItem color="bg-gradient-to-t from-cyan-400 to-blue-500" label="Searching" />
      <LegendItem color="bg-gradient-to-t from-green-400 to-green-600" label="Sorted/Found" />
    </div>
  );
};


import React from 'react';
import { AlgorithmInfo, Stats, AlgorithmType, GreedyAlgorithm, Algorithm } from '../types';

interface InfoPanelProps {
  algorithmInfo: AlgorithmInfo;
  stats: Stats;
  arraySize: number;
  type: AlgorithmType;
  algorithm: Algorithm;
}

const StatBox: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="bg-white/80 p-4 rounded-lg border-2 border-gray-200 text-center">
    <div className="text-3xl font-bold text-indigo-600">{value}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

export const InfoPanel: React.FC<InfoPanelProps> = ({ algorithmInfo, stats, arraySize, type, algorithm }) => {

  const getStatLabel = () => {
    if (type === AlgorithmType.GREEDY) {
        if (algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
            return "Jobs Processed";
        }
         if (algorithm === GreedyAlgorithm.KNAPSACK) {
            return "Total Value";
        }
    }
    return "Swaps/Moves";
  }

  return (
    <div className="mt-8">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-6">
        <h3 className="text-2xl font-bold text-indigo-800 mb-2">{algorithmInfo.name}</h3>
        <p className="text-gray-700">{algorithmInfo.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox value={stats.comparisons} label="Comparisons" />
        <StatBox value={stats.profit?.toFixed(2) ?? stats.swaps} label={getStatLabel()} />
        {algorithm === GreedyAlgorithm.KNAPSACK && <StatBox value={stats.weight?.toFixed(2) ?? 0} label="Total Weight" />}
        <StatBox value={arraySize} label="Data Size" />
      </div>
    </div>
  );
};

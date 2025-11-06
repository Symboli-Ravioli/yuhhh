
import React from 'react';
import { Algorithm, AlgorithmType, GreedyAlgorithm } from '../types';
import { ALGORITHM_OPTIONS } from '../constants';

interface ControlsProps {
  algorithmType: AlgorithmType;
  setAlgorithmType: (type: AlgorithmType) => void;
  algorithm: Algorithm;
  setAlgorithm: (algo: Algorithm) => void;
  arrayInput: string;
  setArrayInput: (input: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  knapsackCapacity: string;
  setKnapsackCapacity: (value: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onGenerateRandom: () => void;
  onReset: () => void;
}

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="font-semibold text-sm text-gray-600">{label}</label>
    {children}
  </div>
);

const inputStyles = "w-full p-2.5 bg-white/50 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";
const buttonStyles = "px-5 py-2.5 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

export const Controls: React.FC<ControlsProps> = ({
  algorithmType, setAlgorithmType, algorithm, setAlgorithm,
  arrayInput, setArrayInput, searchValue, setSearchValue,
  knapsackCapacity, setKnapsackCapacity, speed, setSpeed,
  isRunning, onStart, onGenerateRandom, onReset
}) => {

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as AlgorithmType;
    setAlgorithmType(newType);
    setAlgorithm(ALGORITHM_OPTIONS[newType][0].value);
  };

  const getInputPlaceholder = () => {
    if (algorithmType === AlgorithmType.GREEDY) {
      if (algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
        return 'profit1,deadline1;profit2,deadline2';
      }
      if (algorithm === GreedyAlgorithm.KNAPSACK) {
        return 'value1,weight1;value2,weight2';
      }
    }
    return 'e.g., 64, 34, 25, 12, 22, 11, 90';
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <ControlGroup label="Algorithm Type">
          <select value={algorithmType} onChange={handleTypeChange} disabled={isRunning} className={inputStyles}>
            <option value={AlgorithmType.SORTING}>Sorting</option>
            <option value={AlgorithmType.SEARCHING}>Searching</option>
            <option value={AlgorithmType.GREEDY}>Greedy Algorithms</option>
          </select>
        </ControlGroup>
        
        <ControlGroup label="Algorithm">
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as Algorithm)} disabled={isRunning} className={inputStyles}>
            {ALGORITHM_OPTIONS[algorithmType].map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </ControlGroup>

        <ControlGroup label="Data Input">
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder={getInputPlaceholder()} disabled={isRunning} className={inputStyles} />
        </ControlGroup>
        
        {algorithmType === AlgorithmType.SEARCHING && (
          <ControlGroup label="Search Value">
            <input type="number" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Value to find" disabled={isRunning} className={inputStyles} />
          </ControlGroup>
        )}

        {algorithm === GreedyAlgorithm.KNAPSACK && (
          <ControlGroup label="Knapsack Capacity">
            <input type="number" value={knapsackCapacity} onChange={(e) => setKnapsackCapacity(e.target.value)} placeholder="e.g., 50" disabled={isRunning} className={inputStyles} />
          </ControlGroup>
        )}

        <ControlGroup label={`Speed: ${speed}ms`}>
          <input type="range" min="50" max="2000" step="50" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} disabled={isRunning} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </ControlGroup>
      </div>

      <div className="flex flex-wrap gap-4">
        <button onClick={onStart} disabled={isRunning} className={`${buttonStyles} bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30`}>Start</button>
        <button onClick={onGenerateRandom} disabled={isRunning} className={`${buttonStyles} bg-gray-200 text-gray-700 hover:bg-gray-300`}>Generate Random</button>
        <button onClick={onReset} disabled={isRunning} className={`${buttonStyles} bg-gray-200 text-gray-700 hover:bg-gray-300`}>Reset</button>
      </div>
    </div>
  );
};

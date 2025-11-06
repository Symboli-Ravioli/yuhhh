
import React from 'react';
import { Algorithm, AlgorithmType, Bar, Job, KnapsackItem, GreedyAlgorithm } from '../types';

interface VisualizationProps {
  type: AlgorithmType;
  algorithm: Algorithm;
  bars: Bar[];
  jobs: Job[];
  jobSlots: (Job | null)[];
  knapsackItems: KnapsackItem[];
  knapsackContent: {item: KnapsackItem, weight: number}[];
  knapsackCapacity: number;
  currentKnapsackWeight: number;
  totalKnapsackValue: number;
}

const getBarColor = (state: Bar['state']) => {
  switch (state) {
    case 'comparing': return 'bg-gradient-to-t from-yellow-400 to-orange-500 -translate-y-2.5';
    case 'swapping': return 'bg-gradient-to-t from-red-500 to-red-700 scale-110';
    case 'sorted': return 'bg-gradient-to-t from-green-400 to-green-600';
    case 'found': return 'bg-gradient-to-t from-green-400 to-green-600 scale-125 shadow-lg shadow-green-400/50';
    case 'searching': return 'bg-gradient-to-t from-cyan-400 to-blue-500';
    case 'pivot': return 'bg-gradient-to-t from-pink-500 to-rose-500';
    default: return 'bg-gradient-to-t from-indigo-500 to-purple-600';
  }
};

const SortingSearchingView: React.FC<{ bars: Bar[] }> = ({ bars }) => {
  const maxValue = Math.max(1, ...bars.map(b => b.value));
  return (
    <div className="flex items-end justify-center gap-1">
      {bars.map((bar, idx) => (
        <div key={idx}
             className={`rounded-t-md relative transition-all duration-300 ease-in-out flex items-end justify-center text-white font-bold text-sm pb-1 ${getBarColor(bar.state)}`}
             style={{
               height: `${(bar.value / maxValue) * 300 + 20}px`,
               width: `${Math.max(10, 800 / (bars.length * 1.5))}px`
             }}>
          {bar.value}
        </div>
      ))}
    </div>
  );
};

const JobSequencingView: React.FC<{ jobs: Job[], jobSlots: (Job | null)[] }> = ({ jobs, jobSlots }) => {
    const jobStatusClasses = (status?: Job['status']) => {
        switch (status) {
            case 'processing': return 'border-orange-500 bg-orange-50';
            case 'accepted': return 'border-green-500 bg-green-50';
            case 'rejected': return 'border-red-500 bg-red-50 opacity-60';
            default: return 'border-gray-200 bg-white';
        }
    };
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Available Jobs</h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {jobs.map((job) => (
              <div key={job.id} className={`p-4 rounded-lg border-2 transition-all duration-300 ${jobStatusClasses(job.status)}`}>
                <div className="flex justify-between items-center font-bold">
                  <span>{job.id}</span>
                  <span className="text-green-600">Profit: {job.profit}</span>
                  <span className="text-blue-600">Deadline: {job.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Time Slots</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {jobSlots.map((job, idx) => (
              <div key={idx} className={`h-24 rounded-lg flex items-center justify-center text-center p-2 border-2 ${job ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-300 border-dashed'}`}>
                {job ? (
                  <div className="font-bold text-green-800">
                    <div>{job.id}</div>
                    <div className="text-sm">Profit: {job.profit}</div>
                  </div>
                ) : <span className="text-gray-500">Slot {idx+1}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

const KnapsackView: React.FC<Omit<VisualizationProps, 'type' | 'algorithm' | 'bars' | 'jobs' | 'jobSlots'>> = (props) => {
    const { knapsackItems, knapsackContent, knapsackCapacity, currentKnapsackWeight, totalKnapsackValue } = props;
    const itemStatusClasses = (status?: KnapsackItem['status']) => {
        switch (status) {
            case 'considering': return 'border-orange-500 bg-orange-50 ring-4 ring-orange-200';
            case 'taken': return 'border-green-500 bg-green-50';
            case 'fraction_taken': return 'border-teal-500 bg-teal-50';
            default: return 'border-gray-200 bg-white';
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Available Items</h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {knapsackItems.map(item => (
                        <div key={item.id} className={`p-4 rounded-lg border-2 transition-all duration-300 ${itemStatusClasses(item.status)}`}>
                            <div className="flex justify-between items-center font-bold">
                                <span>{item.id}</span>
                                <span className="text-green-600">Value: {item.value}</span>
                                <span className="text-blue-600">Weight: {item.weight}</span>
                                <span className="text-purple-600">Ratio: {item.ratio.toFixed(2)}</span>
                            </div>
                            {item.status === 'fraction_taken' && item.fraction && (
                                <div className="text-center mt-2 text-sm font-semibold text-teal-700">Taken: {(item.fraction * 100).toFixed(0)}%</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Knapsack</h3>
                <div className="w-full max-w-sm h-64 bg-gray-200 rounded-lg border-4 border-gray-400 p-2 flex flex-col justify-end relative">
                    <div className="absolute top-2 left-2 right-2 text-center font-bold text-gray-700">
                        <div>Value: {totalKnapsackValue.toFixed(2)}</div>
                        <div>Weight: {currentKnapsackWeight.toFixed(2)} / {knapsackCapacity}</div>
                    </div>
                    <div className="bg-gradient-to-t from-indigo-500 to-purple-500 w-full rounded transition-all duration-500" style={{height: `${(currentKnapsackWeight / knapsackCapacity) * 100}%`}}></div>
                </div>
            </div>
        </div>
    );
}

export const Visualization: React.FC<VisualizationProps> = (props) => {
  const { type, algorithm } = props;

  const renderContent = () => {
    if (type === AlgorithmType.SORTING || type === AlgorithmType.SEARCHING) {
      return <SortingSearchingView bars={props.bars} />;
    }
    if (type === AlgorithmType.GREEDY) {
      if (algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
        return <JobSequencingView jobs={props.jobs} jobSlots={props.jobSlots} />;
      }
      if (algorithm === GreedyAlgorithm.KNAPSACK) {
          return <KnapsackView {...props} />;
      }
    }
    return <div className="text-gray-500">Select an algorithm to begin.</div>;
  };
  
  return (
    <div className="bg-gray-100/50 rounded-xl p-4 sm:p-8 mb-6 min-h-[400px] flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

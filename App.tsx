
import React, { useState, useCallback, useEffect } from 'react';
import { Controls } from './components/Controls';
import { Visualization } from './components/Visualization';
import { InfoPanel } from './components/InfoPanel';
import { Legend } from './components/Legend';
import { AlgorithmType, Algorithm, Bar, Job, KnapsackItem, Stats, SortingAlgorithm, GreedyAlgorithm, SearchingAlgorithm } from './types';
import { ALGO_INFO, ALGORITHM_OPTIONS, DEFAULT_ARRAY_INPUT, DEFAULT_JOB_INPUT, DEFAULT_KNAPSACK_INPUT, DEFAULT_SPEED } from './constants';

const App: React.FC = () => {
    const [arrayInput, setArrayInput] = useState<string>(DEFAULT_ARRAY_INPUT);
    const [algorithmType, setAlgorithmType] = useState<AlgorithmType>(AlgorithmType.SORTING);
    const [algorithm, setAlgorithm] = useState<Algorithm>(SortingAlgorithm.BUBBLE);
    const [speed, setSpeed] = useState<number>(DEFAULT_SPEED);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState<string>('');
    const [knapsackCapacity, setKnapsackCapacity] = useState<string>('50');

    // Visualization state
    const [bars, setBars] = useState<Bar[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobSlots, setJobSlots] = useState<(Job | null)[]>([]);
    const [knapsackItems, setKnapsackItems] = useState<KnapsackItem[]>([]);
    const [knapsackContent, setKnapsackContent] = useState<{item: KnapsackItem, weight: number}[]>([]);
    const [currentKnapsackWeight, setCurrentKnapsackWeight] = useState(0);
    const [totalKnapsackValue, setTotalKnapsackValue] = useState(0);

    const [stepInfo, setStepInfo] = useState<string>('Enter data and click Start to begin');
    const [stats, setStats] = useState<Stats>({ comparisons: 0, swaps: 0 });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetState = useCallback(() => {
        setIsRunning(false);
        setBars([]);
        setJobs([]);
        setJobSlots([]);
        setKnapsackItems([]);
        setKnapsackContent([]);
        setCurrentKnapsackWeight(0);
        setTotalKnapsackValue(0);
        setStats({ comparisons: 0, swaps: 0 });
        setStepInfo('Enter data and click Start to begin');
    }, []);

    const parseAndSetInitialState = useCallback(() => {
        resetState();
        if (algorithmType === AlgorithmType.SORTING || algorithmType === AlgorithmType.SEARCHING) {
            const parsedArray = arrayInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
            if (parsedArray.length > 0) {
                setBars(parsedArray.map(value => ({ value, state: 'default' })));
            }
        } else if (algorithmType === AlgorithmType.GREEDY) {
            if (algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
                const parsedJobs = arrayInput.split(';').map((job, idx) => {
                    const [profit, deadline] = job.split(',').map(x => parseInt(x.trim()));
                    return { id: `J${idx + 1}`, profit, deadline, status: 'default' } as Job;
                }).filter(j => !isNaN(j.profit) && !isNaN(j.deadline));
                setJobs(parsedJobs);
            } else if (algorithm === GreedyAlgorithm.KNAPSACK) {
                const parsedItems = arrayInput.split(';').map((item, idx) => {
                    const [value, weight] = item.split(',').map(x => parseInt(x.trim()));
                    return { id: `I${idx+1}`, value, weight, ratio: weight > 0 ? value / weight : 0, status: 'default' } as KnapsackItem;
                }).filter(i => !isNaN(i.value) && !isNaN(i.weight));
                setKnapsackItems(parsedItems);
            }
        }
    }, [algorithmType, algorithm, arrayInput, resetState]);


    useEffect(() => {
        if (algorithmType === AlgorithmType.SORTING || algorithmType === AlgorithmType.SEARCHING) {
             setArrayInput(DEFAULT_ARRAY_INPUT);
        } else if (algorithmType === AlgorithmType.GREEDY) {
             if(algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
                setArrayInput(DEFAULT_JOB_INPUT);
             } else {
                setArrayInput(DEFAULT_KNAPSACK_INPUT);
             }
        }
    }, [algorithmType, algorithm]);
    
    useEffect(() => {
        parseAndSetInitialState();
    }, [arrayInput, algorithm, algorithmType, parseAndSetInitialState]);

    const handleGenerateRandom = () => {
        if (algorithmType === AlgorithmType.GREEDY) {
            if (algorithm === GreedyAlgorithm.JOB_SEQUENCING) {
                const numJobs = Math.floor(Math.random() * 5) + 5;
                const maxDeadline = Math.floor(numJobs * 0.7);
                const randomJobs = Array.from({ length: numJobs }, () => {
                    const profit = Math.floor(Math.random() * 90) + 10;
                    const deadline = Math.floor(Math.random() * maxDeadline) + 1;
                    return `${profit},${deadline}`;
                });
                setArrayInput(randomJobs.join(';'));
            } else if (algorithm === GreedyAlgorithm.KNAPSACK) {
                const numItems = Math.floor(Math.random() * 5) + 4;
                const randomItems = Array.from({ length: numItems }, () => {
                    const value = Math.floor(Math.random() * 100) + 20;
                    const weight = Math.floor(Math.random() * 40) + 10;
                    return `${value},${weight}`;
                });
                setArrayInput(randomItems.join(';'));
                setKnapsackCapacity(String(Math.floor(Math.random() * 100) + 50));
            }
        } else {
            const size = Math.floor(Math.random() * 10) + 8;
            const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
            setArrayInput(randomArray.join(', '));
        }
    };
    
    // --- ALGORITHMS ---
    
    const bubbleSort = async () => {
        let localBars = [...bars];
        const n = localBars.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                localBars[j].state = 'comparing';
                localBars[j + 1].state = 'comparing';
                setBars([...localBars]);
                setStepInfo(`Comparing ${localBars[j].value} and ${localBars[j + 1].value}`);
                setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
                await sleep(speed);

                if (localBars[j].value > localBars[j + 1].value) {
                    localBars[j].state = 'swapping';
                    localBars[j + 1].state = 'swapping';
                    setBars([...localBars]);
                    setStepInfo(`Swapping ${localBars[j].value} and ${localBars[j + 1].value}`);
                    await sleep(speed);
                    [localBars[j], localBars[j + 1]] = [localBars[j + 1], localBars[j]];
                    setStats(s => ({ ...s, swaps: s.swaps + 1 }));
                }
                
                localBars[j].state = 'default';
                localBars[j + 1].state = 'default';
                setBars([...localBars]);
            }
            localBars[n - 1 - i].state = 'sorted';
            setBars([...localBars]);
        }
        localBars[0].state = 'sorted';
        setBars([...localBars]);
    };
    
    const linearSearch = async () => {
        const target = parseInt(searchValue);
        if (isNaN(target)) {
            setStepInfo('Invalid search value.');
            return;
        }
        
        let localBars = [...bars];
        for (let i = 0; i < localBars.length; i++) {
            localBars[i].state = 'searching';
            setBars([...localBars]);
            setStepInfo(`Checking index ${i}: value ${localBars[i].value}`);
            setStats(s => ({...s, comparisons: s.comparisons + 1}));
            await sleep(speed);
            
            if (localBars[i].value === target) {
                localBars[i].state = 'found';
                setBars([...localBars]);
                setStepInfo(`✅ Value ${target} found at index ${i}!`);
                return;
            }
            localBars[i].state = 'default';
        }
        
        setBars(localBars);
        setStepInfo(`❌ Value ${target} not found in array.`);
    };

    const jobSequencing = async () => {
        let localJobs = [...jobs];
        setStepInfo('Sorting jobs by profit (descending)...');
        localJobs.sort((a, b) => b.profit - a.profit);
        setJobs([...localJobs]);
        await sleep(speed * 1.5);

        const maxDeadline = Math.max(0, ...localJobs.map(j => j.deadline));
        let localSlots = new Array(maxDeadline).fill(null);
        setJobSlots(localSlots);
        setStepInfo(`Max deadline: ${maxDeadline}. Created ${maxDeadline} slots.`);
        await sleep(speed * 1.5);
        
        let totalProfit = 0;
        for (let i = 0; i < localJobs.length; i++) {
            const job = localJobs[i];
            job.status = 'processing';
            setJobs([...localJobs]);
            setStepInfo(`Processing Job ${job.id}: Profit=${job.profit}, Deadline=${job.deadline}`);
            await sleep(speed);
            
            let slotFound = false;
            for (let j = Math.min(maxDeadline, job.deadline) - 1; j >= 0; j--) {
                setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
                if (localSlots[j] === null) {
                    localSlots[j] = job;
                    slotFound = true;
                    totalProfit += job.profit;
                    
                    job.status = 'accepted';
                    setJobs([...localJobs]);
                    setJobSlots([...localSlots]);
                    setStats(s => ({ ...s, profit: totalProfit }));
                    setStepInfo(`✓ Job ${job.id} scheduled! Total Profit: ${totalProfit}`);
                    await sleep(speed * 1.5);
                    break;
                }
            }
            if (!slotFound) {
                job.status = 'rejected';
                setJobs([...localJobs]);
                setStepInfo(`✗ Job ${job.id} rejected - no available slot.`);
                await sleep(speed);
            }
        }
        setStepInfo(`🎉 Scheduling Complete! Final Profit: ${totalProfit}`);
    };

    const fractionalKnapsack = async () => {
        const capacity = parseInt(knapsackCapacity);
        if (isNaN(capacity) || capacity <= 0) {
            setStepInfo('Invalid knapsack capacity.');
            return;
        }

        let localItems = [...knapsackItems];
        setStepInfo('Sorting items by value-to-weight ratio (descending)...');
        localItems.sort((a, b) => b.ratio - a.ratio);
        setKnapsackItems([...localItems]);
        await sleep(speed * 1.5);

        let currentWeight = 0;
        let finalValue = 0;
        let localKnapsackContent: {item: KnapsackItem, weight: number}[] = [];

        for (let i = 0; i < localItems.length; i++) {
            const item = localItems[i];
            item.status = 'considering';
            setKnapsackItems([...localItems]);
            setStepInfo(`Considering Item ${item.id} (Value: ${item.value}, Weight: ${item.weight}, Ratio: ${item.ratio.toFixed(2)})`);
            await sleep(speed);

            if (currentWeight + item.weight <= capacity) {
                // Take the whole item
                currentWeight += item.weight;
                finalValue += item.value;
                item.status = 'taken';
                item.fraction = 1;
                localKnapsackContent.push({item, weight: item.weight});

                setStepInfo(`✅ Taking all of Item ${item.id}.`);
            } else {
                // Take a fraction of the item
                const remainingWeight = capacity - currentWeight;
                if (remainingWeight > 0) {
                    const fraction = remainingWeight / item.weight;
                    finalValue += item.value * fraction;
                    currentWeight += remainingWeight;
                    item.status = 'fraction_taken';
                    item.fraction = fraction;
                    localKnapsackContent.push({item, weight: remainingWeight});

                    setStepInfo(`✅ Taking ${fraction.toFixed(2)} of Item ${item.id}.`);
                } else {
                   setStepInfo(`Knapsack is full. Can't take Item ${item.id}.`);
                }
            }
            
            setKnapsackItems([...localItems]);
            setCurrentKnapsackWeight(currentWeight);
            setTotalKnapsackValue(finalValue);
            setKnapsackContent([...localKnapsackContent]);
            setStats({ comparisons: 0, swaps: 0, profit: finalValue, weight: currentWeight });
            await sleep(speed * 1.5);
            
            if (currentWeight >= capacity) {
                setStepInfo('Knapsack is full.');
                break;
            }
        }
        
        // Mark remaining items
        localItems.forEach(item => {
            if (item.status === 'default' || item.status === 'considering') {
                item.status = 'default';
            }
        });
        setKnapsackItems([...localItems]);
        setStepInfo(`🎉 Knapsack Complete! Total Value: ${finalValue.toFixed(2)}`);
    };

    // --- START VISUALIZATION ---
    
    const startVisualization = async () => {
        setIsRunning(true);
        parseAndSetInitialState();
        await sleep(100); // allow state to update

        // The state should be up-to-date now
        switch(algorithm) {
            case SortingAlgorithm.BUBBLE: await bubbleSort(); break;
            case SearchingAlgorithm.LINEAR: await linearSearch(); break;
            case GreedyAlgorithm.JOB_SEQUENCING: await jobSequencing(); break;
            case GreedyAlgorithm.KNAPSACK: await fractionalKnapsack(); break;
            // Add other algorithms here...
            default: setStepInfo('Algorithm not implemented yet.');
        }

        if (algorithm !== GreedyAlgorithm.KNAPSACK && algorithm !== GreedyAlgorithm.JOB_SEQUENCING) {
            setStepInfo('✅ Visualization Complete!');
        }
        setIsRunning(false);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-8 shadow-2xl shadow-indigo-200/50">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        🎯 Sorting &amp; Searching Visualizer
                    </h1>
                </header>

                <Controls
                    algorithmType={algorithmType}
                    setAlgorithmType={setAlgorithmType}
                    algorithm={algorithm}
                    setAlgorithm={(val) => setAlgorithm(val as Algorithm)}
                    arrayInput={arrayInput}
                    setArrayInput={setArrayInput}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    knapsackCapacity={knapsackCapacity}
                    setKnapsackCapacity={setKnapsackCapacity}
                    speed={speed}
                    setSpeed={setSpeed}
                    isRunning={isRunning}
                    onStart={startVisualization}
                    onGenerateRandom={handleGenerateRandom}
                    onReset={resetState}
                />

                <div className="text-center font-medium text-lg text-gray-700 my-4 min-h-[28px]">
                    {stepInfo}
                </div>

                <Visualization
                    type={algorithmType}
                    algorithm={algorithm}
                    bars={bars}
                    jobs={jobs}
                    jobSlots={jobSlots}
                    knapsackItems={knapsackItems}
                    knapsackContent={knapsackContent}
                    knapsackCapacity={parseInt(knapsackCapacity) || 0}
                    currentKnapsackWeight={currentKnapsackWeight}
                    totalKnapsackValue={totalKnapsackValue}
                />

                <Legend type={algorithmType} algorithm={algorithm} />

                <InfoPanel
                    algorithmInfo={ALGO_INFO[algorithm]}
                    stats={stats}
                    arraySize={bars.length || jobs.length || knapsackItems.length}
                    type={algorithmType}
                    algorithm={algorithm}
                />
            </main>
        </div>
    );
};

export default App;

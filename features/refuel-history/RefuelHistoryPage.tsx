
import React, { useState } from 'react';
import { useAppStore } from '../../store';
import HistoryList from './components/HistoryList';
import AddRefuelModal from './components/AddRefuelModal';

const RefuelHistoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const refuelHistory = useAppStore((state) => state.refuelHistory);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-brand-text-primary">Refuel History</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-lg shadow-glow-primary hover:opacity-90 transition-opacity"
                >
                    Add Log
                </button>
            </div>

            <div className="flex-grow bg-brand-surface rounded-2xl overflow-hidden">
                {refuelHistory.length > 0 ? (
                    <HistoryList records={refuelHistory} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-brand-text-secondary">No refuel history yet.</p>
                    </div>
                )}
            </div>

            <AddRefuelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default RefuelHistoryPage;

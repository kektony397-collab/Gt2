import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { parseRefuelText } from '../../../services/geminiService';

interface AddRefuelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRefuelModal: React.FC<AddRefuelModalProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [isPartial, setIsPartial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addRefuelRecord = useAppStore((state) => state.addRefuelRecord);
  const totalDistanceKm = useAppStore((state) => state.bikeState.totalDistanceKm);


  if (!isOpen) return null;
  
  const handleClose = () => {
      setText('');
      setIsPartial(false);
      setError(null);
      onClose();
  }

  const handleSubmit = async () => {
    if (!text) return;
    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseRefuelText(text);
      if (!parsedData.liters || parsedData.liters <= 0) {
        throw new Error("Invalid data returned from AI. Please try a more specific prompt.");
      }
      
      const newRecord = {
        id: Date.now(),
        timestamp: Date.now(),
        odometer: Math.round(totalDistanceKm), // Using current odometer from state
        isPartial: isPartial,
        ...parsedData,
      };
      
      addRefuelRecord(newRecord); // Optimistic UI update
      handleClose();

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-brand-surface rounded-2xl p-6 w-full max-w-sm m-4 shadow-lg border border-brand-primary/20" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-brand-primary mb-4">Log Refuel with AI</h2>
        <p className="text-sm text-brand-text-secondary mb-4">
          Describe your refuel, e.g., "Filled up 12.5 liters for $23.50" or "topped up with 5L".
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter refuel details..."
          className="w-full h-24 bg-brand-bg p-2 rounded-lg border border-brand-primary/30 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
          disabled={isLoading}
        />
        
        <div className="mt-4">
            <label className="flex items-center text-brand-text-secondary">
                <input
                    type="checkbox"
                    checked={isPartial}
                    onChange={(e) => setIsPartial(e.target.checked)}
                    className="h-4 w-4 rounded bg-brand-bg border-brand-primary/50 text-brand-primary focus:ring-brand-primary"
                />
                <span className="ml-2 text-sm">Is this a partial fill-up?</span>
            </label>
        </div>

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={handleClose} className="text-brand-text-secondary font-semibold py-2 px-4 rounded-lg">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text}
            className="bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-lg shadow-glow-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-brand-bg/50 border-t-brand-bg rounded-full animate-spin mr-2"></div>}
            {isLoading ? 'Parsing...' : 'Save Log'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRefuelModal;
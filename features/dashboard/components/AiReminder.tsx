
import React, { useState, useEffect } from 'react';
import { getMaintenanceReminder } from '../../../services/geminiService';
import LoadingSpinner from '../../../components/LoadingSpinner';

const AiReminder: React.FC = () => {
  const [reminder, setReminder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminder = async () => {
      setLoading(true);
      try {
        const result = await getMaintenanceReminder({ odometer: 12550, lastServiceOdometer: 9800 });
        setReminder(result.reminder);
      } catch (error) {
        console.error("Failed to get AI reminder:", error);
        setReminder("Could not fetch maintenance reminder.");
      } finally {
        setLoading(false);
      }
    };

    fetchReminder();
  }, []);

  return (
    <div className="bg-brand-surface rounded-2xl p-4">
      <h3 className="text-sm font-bold text-brand-secondary mb-2">AI Maintenance Tip</h3>
      {loading ? (
        <div className="flex justify-center items-center h-10">
            <div className="w-6 h-6 border-2 border-brand-secondary/20 border-t-brand-secondary rounded-full animate-spin"></div>
        </div>
      ) : (
        <p className="text-sm text-brand-text-primary">{reminder}</p>
      )}
    </div>
  );
};

export default AiReminder;

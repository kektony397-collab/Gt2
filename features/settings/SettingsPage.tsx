
import React from 'react';
import { useAppStore } from '../../store';
import type { Settings } from '../../types';

const SettingsPage: React.FC = () => {
    const settings = useAppStore((state) => state.settings);
    const setSettings = useAppStore((state) => state.setSettings);

    const handleSave = (newSettings: Settings) => {
        setSettings(newSettings);
        // Maybe show a toast notification
        alert("Settings saved!");
    };

    return (
        <div className="flex flex-col h-full p-2">
            <h1 className="text-2xl font-bold text-brand-text-primary mb-6">Settings</h1>
            <div className="bg-brand-surface p-6 rounded-2xl">
                <SettingsForm currentSettings={settings} onSave={handleSave} />
            </div>
        </div>
    );
};

interface SettingsFormProps {
    currentSettings: Settings;
    onSave: (settings: Settings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ currentSettings, onSave }) => {
    const [formState, setFormState] = React.useState<Settings>(currentSettings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // FIX: Ensure numeric fields are correctly handled as numbers.
        // Number('') correctly evaluates to 0, which is a safe default.
        const isNumeric = e.target.getAttribute('type') === 'number';
        setFormState(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="bikeName" className="block text-sm font-medium text-brand-text-secondary">Bike Name</label>
                <input type="text" name="bikeName" id="bikeName" value={formState.bikeName} onChange={handleChange} className="mt-1 block w-full bg-brand-bg border border-brand-primary/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>

            <div>
                <label htmlFor="tankCapacityLiters" className="block text-sm font-medium text-brand-text-secondary">Tank Capacity (Liters)</label>
                <input type="number" step="0.1" name="tankCapacityLiters" id="tankCapacityLiters" value={formState.tankCapacityLiters} onChange={handleChange} className="mt-1 block w-full bg-brand-bg border border-brand-primary/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            
            <div>
                <label htmlFor="avgConsumptionLitersPer100Km" className="block text-sm font-medium text-brand-text-secondary">Avg. Fuel Consumption (L/100km)</label>
                <input type="number" step="0.1" name="avgConsumptionLitersPer100Km" id="avgConsumptionLitersPer100Km" value={formState.avgConsumptionLitersPer100Km} onChange={handleChange} className="mt-1 block w-full bg-brand-bg border border-brand-primary/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            
             <div>
                <label htmlFor="unitSystem" className="block text-sm font-medium text-brand-text-secondary">Unit System</label>
                <select name="unitSystem" id="unitSystem" value={formState.unitSystem} onChange={handleChange} className="mt-1 block w-full bg-brand-bg border border-brand-primary/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                    <option value="metric">Metric (km, L)</option>
                    <option value="imperial" disabled>Imperial (mi, gal) - Coming Soon</option>
                </select>
            </div>

            <div className="pt-2">
                 <button type="submit" className="w-full bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-lg shadow-glow-primary hover:opacity-90 transition-opacity">Save Settings</button>
            </div>
        </form>
    );
};

export default SettingsPage;
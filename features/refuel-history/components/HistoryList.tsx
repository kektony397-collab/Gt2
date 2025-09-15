import React from 'react';
// FIX: Use a more robust import strategy for react-window to handle CDN module inconsistencies.
// This attempts to find the exports on the namespace directly or on a nested `default` object.
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { RefuelRecord } from '../../../types';

// Resolve the actual module exports, which might be nested under a .default property.
const ResolvedReactWindow = (ReactWindow as any).default || ReactWindow;
const List = ResolvedReactWindow.FixedSizeList;


interface HistoryListProps {
  records: RefuelRecord[];
}

const Row: React.FC<{ index: number, style: React.CSSProperties, data: RefuelRecord[] }> = ({ index, style, data }) => {
  const record = data[index];
  const date = new Date(record.timestamp).toLocaleDateString();

  return (
    <div style={style} className="flex items-center justify-between px-4 border-b border-brand-primary/10">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg mr-4 ${record.isPartial ? 'bg-yellow-500/20 text-yellow-400' : 'bg-brand-accent/20 text-brand-accent'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-12h-2m-2-2v2m-2 12h2m-2 2v-2M9 12l2 2 4-4m6 4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="font-bold text-brand-text-primary">{record.liters.toFixed(2)} Liters {record.isPartial && <span className="text-xs font-normal text-yellow-400">(Partial)</span>}</p>
          <p className="text-xs text-brand-text-secondary">{date} @ {record.odometer} km</p>
        </div>
      </div>
      {record.cost && <p className="font-mono text-lg font-bold text-brand-accent">${record.cost.toFixed(2)}</p>}
    </div>
  );
};


const HistoryList: React.FC<HistoryListProps> = ({ records }) => {
    // Sort records descending by timestamp
    const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  // Add a guard in case the import fails silently and List is undefined.
  if (!List) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-center p-4">
          <span className="font-bold">Error: The list component failed to load.</span>
          <br/>This might be a temporary CDN or module loading issue.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
        <AutoSizer>
        {({ height, width }) => (
            <List
                className="history-list"
                height={height}
                itemCount={sortedRecords.length}
                itemSize={75}
                width={width}
                itemData={sortedRecords}
            >
                {Row}
            </List>
        )}
        </AutoSizer>
    </div>
  );
};

export default HistoryList;
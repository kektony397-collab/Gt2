import React from 'react';
// FIX: Use a namespace import for react-window to resolve build errors
// with the CDN module format, as named imports are failing.
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { RefuelRecord } from '../../../types';

// Access FixedSizeList from the namespace and alias it to 'List'
const List = (ReactWindow as any).FixedSizeList;

interface HistoryListProps {
  records: RefuelRecord[];
}

const Row: React.FC<{ index: number, style: React.CSSProperties, data: RefuelRecord[] }> = ({ index, style, data }) => {
  const record = data[index];
  const date = new Date(record.timestamp).toLocaleDateString();

  return (
    <div style={style} className="flex items-center justify-between px-4 border-b border-brand-primary/10">
      <div className="flex items-center">
        <div className="bg-brand-accent/20 text-brand-accent p-3 rounded-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-12h-2m-2-2v2m-2 12h2m-2 2v-2M9 12l2 2 4-4m6 4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="font-bold text-brand-text-primary">{record.liters.toFixed(2)} Liters</p>
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
        <p className="text-red-400 text-center">
          Error: The list component failed to load.<br/>This might be a CDN or module loading issue.
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

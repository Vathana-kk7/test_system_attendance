import React, { useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { formatToDDMMYYYY, toInputValue } from '../../utils/formatDate';

/**
 * DateNavigator
 * - Shows a rounded pill with prev/next arrows
 * - Displays date as DD/MM/YYYY
 * - Calendar icon opens native date picker
 *
 * Props:
 * - value: Date | string (ISO or yyyy-MM-dd)
 * - onChange: (date: Date) => void
 * - className: string (optional)
 */
export default function DateNavigator({ value, onChange, className = '' }) {
  const inputRef = useRef(null);

  const date = useMemo(() => {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    // try parsing strings
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [value]);

  const handleChange = useCallback(
    (d) => {
      if (typeof onChange === 'function') {
        onChange(d);
      }
    },
    [onChange]
  );

  const addDays = useCallback(
    (n) => {
      const d = new Date(date);
      d.setDate(d.getDate() + n);
      handleChange(d);
    },
    [date, handleChange]
  );

  const openPicker = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker();
    } else {
      el.click();
    }
  }, []);

  return (
    <div
      className={`flex items-center gap-3 border border-gray-300 shadow bg-white rounded-full px-3 py-1 select-none ${className}`}
      role="group"
      aria-label="Date navigator"
    >
      <button
        type="button"
        onClick={() => addDays(-1)}
        className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="text-sm font-semibold tabular-nums min-w-[110px] text-center">
        {formatToDDMMYYYY(date)}
      </div>

      <button
        type="button"
        onClick={openPicker}
        className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
        aria-label="Open calendar"
      >
        <CalendarDays className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => addDays(1)}
        className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Hidden native date input to leverage browser date picker */}
      <input
        ref={inputRef}
        type="date"
        value={toInputValue(date)}
        onChange={(e) => {
          const next = new Date(e.target.value + 'T00:00:00');
          if (!isNaN(next.getTime())) handleChange(next);
        }}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

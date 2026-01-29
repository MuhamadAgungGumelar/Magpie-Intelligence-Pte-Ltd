"use client";

import React from "react";
import { DateRange } from "@/lib/types/common";
import { subDays, format } from "date-fns";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  presets = true,
}) => {
  const presetOptions = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
  ];

  const handlePreset = (days: number) => {
    onChange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange({
        from: newDate,
        to: value.to,
      });
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange({
        from: value.from,
        to: newDate,
      });
    }
  };

  // Format dates for input type="date" (YYYY-MM-DD)
  const formatInputDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Check if current date range matches a preset
  const isPresetActive = (days: number) => {
    const presetFrom = subDays(new Date(), days);
    const presetTo = new Date();

    // Compare dates (ignore time part)
    const currentFromDate = formatInputDate(value.from);
    const currentToDate = formatInputDate(value.to);
    const presetFromDate = formatInputDate(presetFrom);
    const presetToDate = formatInputDate(presetTo);

    return currentFromDate === presetFromDate && currentToDate === presetToDate;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="space-y-4">
        {/* Date Pickers */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Date Range:
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                From
              </label>
              <input
                type="date"
                value={formatInputDate(value.from)}
                onChange={handleFromDateChange}
                max={formatInputDate(value.to)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <span className="text-gray-400 dark:text-gray-500 mt-5">-</span>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                To
              </label>
              <input
                type="date"
                value={formatInputDate(value.to)}
                onChange={handleToDateChange}
                min={formatInputDate(value.from)}
                max={formatInputDate(new Date())}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Preset Buttons */}
        {presets && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Quick select:
            </span>
            {presetOptions.map((preset) => {
              const isActive = isPresetActive(preset.days);
              return (
                <button
                  key={preset.days}
                  onClick={() => handlePreset(preset.days)}
                  className={`px-3 py-1 text-xs border rounded-md transition-colors ${
                    isActive
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;

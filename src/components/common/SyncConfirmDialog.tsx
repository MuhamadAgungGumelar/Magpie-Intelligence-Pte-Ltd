"use client";

import React from "react";
import { MdSync, MdWarning } from "react-icons/md";

interface SyncConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  syncing?: boolean;
}

const SyncConfirmDialog: React.FC<SyncConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  syncing = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <MdWarning className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Confirm Sync</h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to sync articles from News API? This will fetch new articles from external sources.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={syncing}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={syncing}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {syncing ? (
                <>
                  <MdSync className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <MdSync className="w-4 h-4" />
                  Sync Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncConfirmDialog;

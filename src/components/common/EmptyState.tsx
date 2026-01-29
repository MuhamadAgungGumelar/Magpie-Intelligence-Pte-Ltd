import React from "react";
import { MdInbox } from "react-icons/md";

interface EmptyStateProps {
  icon?: React.ElementType;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = MdInbox,
  title = "No data found",
  message = "There are no items to display",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

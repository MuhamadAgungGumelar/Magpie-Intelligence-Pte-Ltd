'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import useUIStore from '@/store/uiStore';
import { articlesApi } from '@/lib/api/articles';
import { MdWarning } from 'react-icons/md';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface DeleteConfirmDialogProps {
  onSuccess: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ onSuccess }) => {
  const { deleteConfirmDialog, closeDeleteConfirm } = useUIStore();
  const { open, article } = deleteConfirmDialog;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!article) return;

    setLoading(true);
    try {
      await articlesApi.deleteArticle(article.id);
      toast.success('Article deleted successfully');
      closeDeleteConfirm();
      onSuccess();
    } catch (error: unknown) {
      let message = 'Failed to delete article';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <MdWarning className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Delete Article</h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this article? This action cannot be undone.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 mb-6">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{article.title}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeDeleteConfirm}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;

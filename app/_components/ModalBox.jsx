'use client';

import { Plus } from 'lucide-react';

export default function ModalBox({
  children,
  name,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Button to Open Modal */}
      <button
        className="inline-flex items-center gap-2 rounded border cursor-pointer border-orange-500 bg-amber-600 px-8 py-3 text-white hover:bg-amber-700 hover:text-white focus:outline-none focus:ring active:text-buttonBackground"
        onClick={onClose} // Open the modal by calling `onClose` (misleading name, but it works)
      >
        <span className="text-sm font-medium"> {name} </span>
        <Plus className='w-5 h-5' />
      </button>

      {/* Modal Backdrop and Content */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <span></span>
              <button
                onClick={onClose}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
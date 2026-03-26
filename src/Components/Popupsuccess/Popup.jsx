import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Open Modal
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition">
          
          {/* Modal */}
          <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-2xl transform transition-all scale-100">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Action
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item?
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
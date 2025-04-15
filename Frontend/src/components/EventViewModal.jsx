import React from 'react';

const EventViewModal = ({ event, isOpen, onClose, onEdit }) => {
    if (!isOpen || !event) return null; // Ensure modal only renders when open and event is valid

    const {
        title,
        extendedProps: { type, location, notes, startTime, endTime } = {},
        start,
        end,
    } = event;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-grey/30  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                <h3 className="text-lg font-bold mb-2">{title || "Untitled Event"}</h3>
                <p><strong>Type:</strong> {type || "N/A"}</p>
                <p><strong>Location:</strong> {location || "N/A"}</p>
                <p><strong>Notes:</strong> {notes || "N/A"}</p>
                <p><strong>Start:</strong> {startTime ? `${new Date(start).toLocaleDateString()} ${startTime}` : new Date(start).toLocaleString()}</p>
                <p><strong>End:</strong> {endTime ? `${new Date(end).toLocaleDateString()} ${endTime}` : new Date(end).toLocaleString()}</p>

                <button
                    onClick={onEdit}
                    className="mt-4 px-4 py-2 bg-[#FFB600] text-black rounded hover:bg-[#e0a800]"
                >
                    Edit Event
                </button>
                <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default EventViewModal;

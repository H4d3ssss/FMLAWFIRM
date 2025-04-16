import React from 'react';

const EventViewModal = ({ isOpen, onClose, onEdit, onDelete, event }) => {
    if (!isOpen) return null;

    // Example data for lawyers and clients
    const lawyers = [
        { id: 1, name: 'Atty. John Doe' },
        { id: 2, name: 'Atty. Jane Smith' },
        { id: 3, name: 'Atty. Robert Brown' },
    ];

    const clients = [
        { id: 1, name: 'Client Alice Johnson' },
        { id: 2, name: 'Client Bob Williams' },
        { id: 3, name: 'Client Charlie Davis' },
    ];

    const lawyer = lawyers.find((lawyer) => lawyer.id === event.extendedProps?.lawyerId);
    const client = clients.find((client) => client.id === event.extendedProps?.clientId);

    console.log('Lawyer:', lawyer);
    console.log('Client:', client);

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative space-y-4 border">
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>

                <h3 className="text-lg font-bold">{event.title}</h3>
                <p><strong>Type:</strong> {event.extendedProps.type}</p>
                <p><strong>Location:</strong> {event.extendedProps.location}</p>
                <p><strong>Notes:</strong> {event.extendedProps.notes}</p>
                <p><strong>Start:</strong> {new Date(event.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(event.end).toLocaleString()}</p>
                <p><strong>Lawyer:</strong> {lawyer ? lawyer.name : 'Not Assigned'}</p>
                <p><strong>Client:</strong> {client ? client.name : 'Not Assigned'}</p>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={onEdit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(event.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventViewModal;

import React, { useState, useEffect } from 'react';

const eventTypes = [
    'Consultation',
    'Meeting',
    'Case Hearing',
    'Filing',
    'Follow-up',
    'Other',
];
const eventTypeColors = {
    Consultation: '#4CAF50', // Green
    Meeting: '#2196F3', // Blue
    'Case Hearing': '#FF9800', // Orange
    Filing: '#9C27B0', // Purple
    'Follow-up': '#FFC107', // Yellow
    Other: '#607D8B', // Gray
};

const EventEditForm = ({ isOpen, onClose, onSubmit, eventData }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState(eventTypes[0]);
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (isOpen && eventData) {
            // Pre-fill form fields with current event data
            setTitle(eventData.title);
            setType(eventData.extendedProps?.type || eventTypes[0]);
            setLocation(eventData.extendedProps?.location || '');
            setNotes(eventData.extendedProps?.notes || '');
            setStartTime(eventData.extendedProps?.startTime || '');
            setEndTime(eventData.extendedProps?.endTime || '');
        } else {
            // Reset form fields when the form is reopened
            setTitle('');
            setType(eventTypes[0]);
            setLocation('');
            setNotes('');
            setStartTime('');
            setEndTime('');
        }
    }, [isOpen, eventData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return alert('Please enter a title.');
        if (!startTime || !endTime) return alert('Please select start and end times.');
        if (startTime >= endTime) return alert('End time must be after start time.');

        const color = eventTypeColors[type]; // Automatically set color based on event type

        onSubmit({
            id: eventData.id,
            title,
            type,
            location,
            notes,
            startTime,
            endTime,
            color, // Include the color in the updated event data
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative space-y-4 border"
            >
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>

                <h3 className="text-lg font-bold">Edit Event</h3>

                <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // Editable title
                        placeholder="Enter title"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Type of Event</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {eventTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. RTC Branch 12"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional details"
                        className="w-full p-2 border rounded resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#FFB600] text-black py-2 rounded hover:bg-[#e0a800]"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EventEditForm;

import React, { useEffect, useState } from 'react';

const UpcomingEvent = () => {
    // State to hold event data fetched from the backend
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        // Placeholder for backend API call
        // Backend developer: Replace the URL below with the actual API endpoint
        fetch('/api/events/upcoming')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch event data');
                }
                return response.json();
            })
            .then((data) => {
                setEventData(data);
            })
            .catch((error) => {
                console.error('Error fetching event data:', error);
                // Fallback to default event data in case of an error
                setEventData({
                    title: 'No Title Available',
                    type: 'No Type Specified',
                    location: 'No Location Provided',
                    notes: 'No Notes Added',
                    startTime: 'Not Scheduled',
                    endTime: 'Not Scheduled',
                });
            });
    }, []);

    // Default event data to avoid errors if no data is fetched
    const defaultEvent = {
        title: 'No Title Available',
        type: 'No Type Specified',
        location: 'No Location Provided',
        notes: 'No Notes Added',
        startTime: 'Not Scheduled',
        endTime: 'Not Scheduled',
    };

    const event = eventData || defaultEvent; // Use fetched event or fallback to default

    return (
        <div className="bg-white shadow-md rounded-xl p-4 w-[660px] h-[300px] border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h1>
            <div className="text-gray-600 text-sm space-y-2">
                <div className='border border-gray-300 rounded-md p-3 h-50'>
                    <p><strong>Title:</strong> {event.title}</p>
                    <p><strong>Type:</strong> {event.type}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Notes:</strong> {event.notes}</p>
                    <p><strong>Start Time:</strong> {event.startTime}</p>
                    <p><strong>End Time:</strong> {event.endTime}</p>
                </div>
            </div>
        </div>
    );
};

export default UpcomingEvent;

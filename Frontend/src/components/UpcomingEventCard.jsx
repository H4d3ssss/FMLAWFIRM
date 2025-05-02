import React from 'react';
import { Calendar } from 'lucide-react';

const UpcomingEventCard = ({ count, nextEvent }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center w-full h-full min-h-[180px]">
            <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-10 h-10 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            </div>
            <p className="text-3xl font-semibold text-blue-600 mb-2">{count}</p>
            {nextEvent && (
                <p className="text-sm text-gray-600 text-center">
                    Next: {nextEvent.date} - {nextEvent.title}
                </p>
            )}
        </div>
    );
};

export default UpcomingEventCard;


/*
 * Backend Integration Comments:
 *
 * 1. Database for Events:
 *    - Backend should provide an API endpoint to fetch events (e.g., GET /api/events).
 *    - Each event should have fields like:
 *        - id: Unique identifier for the event.
 *        - title: Description or title of the event.
 *        - date: Scheduled date and time of the event.
 *
 * 2. API Integration:
 *    - Replace the `count` and `nextEvent` props with data fetched from the backend.
 *    - Fetch the total number of upcoming events and details of the next scheduled event.
 *
 * 3. Error Handling:
 *    - Handle errors like network issues or empty data gracefully (e.g., display a placeholder message like "No upcoming events").
 *
 * 4. Dynamic Styling:
 *    - Optional: Use Tailwind CSS classes dynamically to style the card based on event urgency or other criteria (e.g., change color based on event date proximity).
 */


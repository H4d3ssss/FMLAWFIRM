import React from 'react';
import { Calendar } from 'lucide-react';

const UpcomingEventCard = ({ count, nextEvent }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-full h-[200px] sm:w-[250px] sm:h-[220px] md:w-[300px] md:h-[250px] m-0">
            {/* Icon and Title */}
            <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-8 h-8 text-blue-600 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">Upcoming Events</h2>
            </div>
            {/* Count */}
            <p className="text-2xl font-semibold text-blue-600 mb-2 sm:text-3xl md:text-4xl">{count}</p>
            {/* Next Event Info */}
            {nextEvent && (
                <p className="text-xs text-gray-600 text-center sm:text-sm">
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


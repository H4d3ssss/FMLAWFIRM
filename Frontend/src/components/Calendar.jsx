import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import EventAddForm from "../components/EventAddForm";
import EventEditForm from "../components/EventEditForm";
import EventViewModal from "../components/EventViewModal"; // Import the Event Modal for viewing
import { useNavigate } from "react-router-dom";
const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false); // For viewing events
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

        console.log(response.data);
        if (response.data.role === "Lawyer") {
          navigate("/calendar");
        } else if (response.data.role === "Client") {
          navigate("/clientdashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
        console.log(error);
      }
    };
    authenticateUser();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments"
        );
        console.log(response.data);
        const formatted = response.data.map((event) => ({
          id: event.appointmend_id,
          title: event.event_title,
          start: event.appointment_date,
          end: event.appointment_date,
          backgroundColor:
            event.type_of_event === "Hearing" ? "#FFB600" : "#4CAF50",
          borderColor:
            event.type_of_event === "Hearing" ? "#FFB600" : "#4CAF50",
          extendedProps: {
            type: event.type_of_event,
            location: event.location,
            notes: event.notes,
            startTime: event.start_time,
            endTime: event.end_time,
          },
        }));
        console.log(formatted);
        setEvents(formatted); // Set the events in state
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
    console.log(count);
  }, [createModalOpen, count]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setCount((prev) => prev + 1);
    setCreateModalOpen(true);
  };

  const handleEventClick = (info) => {
    const eventData = events.find(
      (event) => event.id === parseInt(info.event.id, 10)
    );
    if (!eventData) return;
    setCount((prev) => prev + 1);

    setSelectedEvent(eventData); // Set the selected event
    setViewModalOpen(true); // Open the View Modal
  };

  const handleAddEvent = (data) => {
    const newEvent = {
      id: Date.now(),
      title: data.title,
      start: `${selectedDate}T${data.startTime}`,
      end: `${selectedDate}T${data.endTime}`,
      backgroundColor: data.color, // Use selected color
      borderColor: data.color, // Use selected color
      extendedProps: {
        type: data.type,
        location: data.location,
        notes: data.notes,
        startTime: data.startTime,
        endTime: data.endTime,
        lawyerId: data.lawyerId, // Include lawyerId
        clientId: data.clientId, // Include clientId
      },
    };
    setCount((prev) => prev + 1);

    setEvents((prev) => [...prev, newEvent]);
    setCreateModalOpen(false);
  };

  const handleEditEvent = (updatedEvent) => {
    setCount((prev) => prev + 1);

    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id
        ? {
            ...event,
            title: updatedEvent.title,
            start: `${selectedDate}T${updatedEvent.startTime}`, // Update start time
            end: `${selectedDate}T${updatedEvent.endTime}`, // Update end time
            extendedProps: {
              ...event.extendedProps,
              type: updatedEvent.type,
              location: updatedEvent.location,
              notes: updatedEvent.notes,
              startTime: updatedEvent.startTime,
              endTime: updatedEvent.endTime,
              lawyerId: updatedEvent.lawyerId, // Include lawyerId
              clientId: updatedEvent.clientId, // Include clientId
            },
          }
        : event
    );
    setEvents(updatedEvents);
    setEditModalOpen(false); // Close the edit modal after saving changes
  };

  const handleDeleteEvent = (eventId) => {
    setCount((prev) => prev + 1);

    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    setViewModalOpen(false); // Close the view modal after deletion
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md min-h-screen">
      <h2 className="text-xl font-semibold mb-4">📅 Case Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height={"100vh"}
      />

      {/* Add Event Modal */}
      <EventAddForm
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleAddEvent}
        date={selectedDate}
        events={events} // Pass existing events
      />

      {/* Event View Modal */}
      {viewModalOpen && selectedEvent && (
        <EventViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            setEditModalOpen(true);
          }}
          event={selectedEvent}
        />
      )}

      {/* Event Edit Modal */}
      {editModalOpen && (
        <EventEditForm
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditEvent}
          eventData={selectedEvent}
        />
      )}
    </div>
  );
};

export default Calendar;

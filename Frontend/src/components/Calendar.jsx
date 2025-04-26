import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import EventAddForm from "../components/EventAddForm";
import EventEditForm from "../components/EventEditForm";
import EventViewModal from "../components/EventViewModal";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [count, setCount] = useState(0);
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );
        if (response.data.role === "Lawyer") {
          setAdminId(response.data.lawyerId);
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
          client: event.client,
          lawyer: event.lawyer,
          clientId: event.client_id,
          lawyerId: event.lawyer_id,
          id: event.appointment_id, // corrected field
          title: event.event_title,
          start: `${event.appointment_date}T${event.start_time}`,
          end: `${event.appointment_date}T${event.end_time}`,
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
        setEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, [createModalOpen, count]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setCreateModalOpen(true);
  };

  const handleEventClick = (info) => {
    const eventData = events.find(
      (event) => String(event.id) === info.event.id
    );
    if (!eventData) return;
    console.log(eventData);
    setSelectedEvent(eventData);
    setViewModalOpen(true);
  };

  const handleAddEvent = (data) => {
    // Parse new event times
    const newStart = new Date(`${selectedDate}T${data.startTime}`);
    const newEnd = new Date(`${selectedDate}T${data.endTime}`);
    // Check for overlap
    const overlap = events.some((ev) => {
      const evStart = new Date(ev.start);
      const evEnd = new Date(ev.end);
      return newStart < evEnd && evStart < newEnd;
    });
    if (overlap) {
      alert("Cannot create an event during another event's time slot.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: data.title,
      start: `${selectedDate}T${data.startTime}`,
      end: `${selectedDate}T${data.endTime}`,
      backgroundColor: data.color,
      borderColor: data.color,
      extendedProps: {
        type: data.type,
        location: data.location,
        notes: data.notes,
        startTime: data.startTime,
        endTime: data.endTime,
        lawyerId: data.lawyerId,
        clientId: data.clientId,
      },
    };

    setEvents((prev) => [...prev, newEvent]);
    setCount((prev) => prev + 1);
    setCreateModalOpen(false);
  };

  const handleEditEvent = (updatedEvent) => {
    const date = selectedDate || updatedEvent.start.split("T")[0];
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id
        ? {
            ...event,
            title: updatedEvent.title,
            start: `${date}T${updatedEvent.startTime}`,
            end: `${date}T${updatedEvent.endTime}`,
            extendedProps: {
              ...event.extendedProps,
              type: updatedEvent.type,
              location: updatedEvent.location,
              notes: updatedEvent.notes,
              startTime: updatedEvent.startTime,
              endTime: updatedEvent.endTime,
            },
          }
        : event
    );
    setEvents(updatedEvents);
    setEditModalOpen(false);
    setCount((prev) => prev + 1);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md min-h-screen mx-45 my-20">
      <h2 className="text-xl font-semibold mb-4">📅 Case Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="80vh"
        contentHeight="auto"
      />

      <EventAddForm
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleAddEvent}
        date={selectedDate}
        events={events}
        setCount={setCount}
        adminId={adminId}
      />

      {viewModalOpen && selectedEvent && (
        <EventViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            setEditModalOpen(true);
          }}
          event={selectedEvent}
          adminId={adminId}
        />
      )}

      {editModalOpen && (
        <EventEditForm
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditEvent}
          eventData={selectedEvent}
          adminId={adminId}
          events={events}
        />
      )}
    </div>
  );
};

export default Calendar;

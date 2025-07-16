import React, { useState } from 'react';
import EventForm from '../../Components/Forms/EventForm';
import { createEvent } from '../../API/Events';
import { useNavigate } from 'react-router-dom';

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      // Send to backend
      const payload = {
        ...formData,
        startDate: { __type: 'Date', iso: new Date(formData.startDate).toISOString() },
        endDate: { __type: 'Date', iso: new Date(formData.endDate).toISOString() },
        organizer: {
          __type: 'Pointer',
          className: '_User',
          objectId: 'MCJOLa1cbT', // Replace with actual user from auth
        },
      };

      await createEvent(payload);
      navigate('/events'); // Redirect after success
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('Error creating event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Event</h2>
      <EventForm onSubmit={handleCreate} isSubmitting={loading} />
    </div>
  );
};

export default CreateEventPage;

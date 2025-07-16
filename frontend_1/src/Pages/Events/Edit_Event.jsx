// src/pages/Events/EditEvent.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../../Components/Forms/EventForm';
import { useGetEventById, useUpdateEvent } from '../../Hooks/useEvents';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, loading, error } = useGetEventById(id);
  const { update, isUpdating, error: updateError } = useUpdateEvent();

  const [initialValues, setInitialValues] = useState(null);

  // Prepare initial form values once data is loaded
  useEffect(() => {
    if (response?.data) {
      const eventData = response.data;

      setInitialValues({
        title: eventData.title || '',
        description: eventData.description || '',
        location: eventData.location || '',
        eventType: eventData.eventType || '',
        status: eventData.status || 'scheduled',
        maxParticipants: eventData.maxParticipants || 0,
        startDate: eventData.startDate?.iso
          ? new Date(eventData.startDate.iso).toISOString().slice(0, 16)
          : '',
        endDate: eventData.endDate?.iso
          ? new Date(eventData.endDate.iso).toISOString().slice(0, 16)
          : '',
        organizer: eventData.organizer?.objectId || '', // needed for backend
        imageUrl: eventData.image?.url || null,         // for optional display
        imageFile: null, // only updated if new file is chosen
      });
    }
  }, [response]);

  const handleSubmit = async (formData) => {
    try {
      await update(id, formData);
      navigate('/Events');
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

  if (loading) return <div className="container my-5">Loading event...</div>;
  if (error)
    return (
      <div className="container my-5 text-danger">
        Error loading event: {error.message}
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Edit Event</h2>

      {updateError && (
        <div className="alert alert-danger">Error: {updateError.message}</div>
      )}

      {initialValues && (
        <EventForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
};

export default EditEvent;

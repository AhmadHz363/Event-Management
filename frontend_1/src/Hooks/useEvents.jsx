import { useState, useEffect } from "react";

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../API/Events";
export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createEvent(eventData);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err; // rethrow for caller to handle if needed
    } finally {
      setLoading(false);
    }
  };

  return { create, data, loading, error };
}

export function useGetAllEvents(initialParams = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [params, setParams] = useState(initialParams);
  const fetchEvents = async (overrideParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...params, ...overrideParams };
      const response = await getAllEvents(mergedParams);
      setData(response);
      setParams(mergedParams);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchEvents, params, setParams };
}

export function useGetEventById(eventId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    getEventById(eventId)
      .then(setData)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [eventId]);

  return { data, loading, error };
}

export function useUpdateEvent() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const update = async (id, data) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await updateEvent(id, data);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { update, isUpdating, error };
}

export function useDeleteEvent() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deleteEvent(id);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { remove, isDeleting, error };
}

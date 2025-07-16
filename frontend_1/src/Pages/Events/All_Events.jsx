import React, { useEffect, useState } from "react";
import DataTable from "../../Components/Table/DataTable";
import { useGetAllEvents } from "../../Hooks/useEvents";
import SearchAndAdd from "../../Components/Table/SearchAndAdd";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../Components/Forms/ConfirmModal";
import { useDeleteEvent } from "../../Hooks/useEvents";
const AllEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const navigate = useNavigate();
  const { remove, isDeleting, error: deleteError } = useDeleteEvent();
  const { data, loading, error, fetchEvents } = useGetAllEvents({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventsList = data?.data || [];

  const filteredEvents = eventsList.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (eventId) => {
    navigate(`/Events/${eventId}/edit`);
  };

  const handleDeleteClick = (eventId) => {
    setToDeleteId(eventId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await remove(toDeleteId);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setToDeleteId(null);
      setConfirmOpen(false);
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  const columns = [
    { key: "objectId", title: "ID" },
    { key: "title", title: "Title" },
    { key: "location", title: "Location" },
    { key: "eventType", title: "Type" },
    { key: "status", title: "Status" },
    {
      key: "startDate",
      title: "Start Date",
      render: (row) =>
        row.startDate?.iso
          ? new Date(row.startDate.iso).toLocaleString()
          : "N/A",
    },
    {
      key: "endDate",
      title: "End Date",
      render: (row) =>
        row.endDate?.iso ? new Date(row.endDate.iso).toLocaleString() : "N/A",
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(row.objectId)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDeleteClick(row.objectId)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-3">All Events</h2>

      <SearchAndAdd
        placeholder="Search by title..."
        onSearch={setSearchTerm}
        onAdd={() => navigate("/events/create")}
        addLabel="Add Event"
      />

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {error && (
        <div className="alert alert-danger my-4">
          Error loading events: {error.message || "Unknown error"}
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={filteredEvents} />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AllEvents;

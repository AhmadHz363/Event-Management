// src/components/Forms/EventForm.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

const EventForm = ({ initialValues = {}, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    location: initialValues.location || "",
    eventType: initialValues.eventType || "",
    status: initialValues.status || "scheduled",
    maxParticipants: initialValues.maxParticipants || 0,
    startDate: initialValues.startDate || "",
    endDate: initialValues.endDate || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };
  const sanitizeFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          base64: reader.result.split(",")[1],
          name: sanitizeFileName(file.name),
        });
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imagePayload = null;
    if (imageFile) {
      imagePayload = await convertToBase64(imageFile);
    }

    const submissionData = {
      ...formData,
      imageFile: imagePayload,
    };

    onSubmit?.(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Event Type</label>
        <input
          type="text"
          name="eventType"
          className="form-control"
          value={formData.eventType}
          onChange={handleChange}
        />
      </div>

      <div className="col-12">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Location</label>
        <input
          type="text"
          name="location"
          className="form-control"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Max Participants</label>
        <input
          type="number"
          name="maxParticipants"
          className="form-control"
          value={formData.maxParticipants}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Start Date</label>
        <input
          type="datetime-local"
          name="startDate"
          className="form-control"
          value={formData.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">End Date</label>
        <input
          type="datetime-local"
          name="endDate"
          className="form-control"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="canceled">Canceled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Image Upload */}
      <div className="col-md-6">
        <label className="form-label">Event Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
        />
        {(imagePreview || initialValues.imageUrl) && (
          <div className="mt-2">
            <img
              src={imagePreview || initialValues.imageUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
              className="img-thumbnail"
            />
          </div>
        )}
      </div>

      <div className="col-12">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

EventForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default EventForm;

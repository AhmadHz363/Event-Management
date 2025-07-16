import React from "react";
import {
  useEventCount,
  useEventStatus,
  useEventTrends,
  usePopularEvents,
} from "../../Hooks/useEventStats";

// ✅ Stable values to prevent infinite renders
const FROM_DATE = "2024-01-01";
const TO_DATE = "2024-12-31";
const POPULAR_LIMIT = 3;

const Dashboard = () => {
  const {
    data: count,
    loading: loadingCount,
    error: errorCount,
  } = useEventCount();

  const {
    data: status,
    loading: loadingStatus,
    error: errorStatus,
  } = useEventStatus();

  const {
    data: trends,
    loading: loadingTrends,
    error: errorTrends,
  } = useEventTrends(FROM_DATE, TO_DATE);

  const {
    data: popular,
    loading: loadingPopular,
    error: errorPopular,
  } = usePopularEvents(POPULAR_LIMIT);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Event Analytics Dashboard</h2>
        <div className="text-muted small">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="row">
        {/* Event Count Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-uppercase text-muted small fw-bold mb-2">
                Total Events
              </h5>
              {loadingCount ? (
                <div className="d-flex justify-content-center py-3">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : errorCount ? (
                <div className="alert alert-danger py-2 mb-0">
                  Error loading event count
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <h3 className="mb-0 fw-bold">{count?.totalEvents || 0}</h3>
                  <span className="ms-2 text-success small">
                    <i className="bi bi-arrow-up"></i> 12.5%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Status Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-uppercase text-muted small fw-bold mb-2">
                Event Status
              </h5>
              {loadingStatus ? (
                <div className="d-flex justify-content-center py-3">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : errorStatus ? (
                <div className="alert alert-danger py-2 mb-0">
                  Error loading status
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(status || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="badge bg-primary bg-opacity-10 text-primary p-2"
                    >
                      <span className="d-block small text-uppercase fw-bold">
                        {key}
                      </span>
                      <span className="d-block fs-5 fw-bold">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trends Section */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Event Trends</h5>
                <div className="text-muted small">
                  {FROM_DATE} to {TO_DATE}
                </div>
              </div>
              {loadingTrends ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : errorTrends ? (
                <div className="alert alert-danger">
                  Error loading event trends
                </div>
              ) : !trends || trends.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No event trends available
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Event Name</th>
                        <th scope="col">Date</th>
                        <th scope="col" className="text-end">
                          Registrations
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.map(({ date, count, registrations }) => (
                        <tr key={date}>
                          <td>
                            {registrations?.[0]?.eventTitle || (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="text-end fw-bold">{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Events Section */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Popular Events</h5>
              {loadingPopular ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : errorPopular ? (
                <div className="alert alert-danger">
                  Error loading popular events
                </div>
              ) : !popular || popular.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No popular events available
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {popular.map((event) => (
                    <div
                      key={event.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                    >
                      <div>
                        <h6 className="mb-1 fw-bold">{event.name}</h6>
                        <small className="text-muted">
                          {event.date
                            ? new Date(event.date).toLocaleDateString()
                            : "Date not specified"}
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {event.registrationCount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
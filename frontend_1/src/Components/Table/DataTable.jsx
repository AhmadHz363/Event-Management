// src/components/Table/DataTable.jsx
import React from 'react';

const DataTable = ({ columns, data, striped = true, bordered = true, hover = true }) => {
  const tableClasses = `
    table
    ${striped ? 'table-striped' : ''}
    ${bordered ? 'table-bordered' : ''}
    ${hover ? 'table-hover' : ''}
    mb-0
  `.trim();

  return (
    <div className="table-responsive">
      <table className={tableClasses}>
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.title}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key || col.title}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

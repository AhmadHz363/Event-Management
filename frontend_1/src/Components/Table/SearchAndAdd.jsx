// src/components/Common/SearchAndAdd.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SearchAndAdd = ({
  placeholder = 'Search...',
  onSearch,
  onAdd,
  addLabel = 'Add',
  showAdd = true,
}) => {
  const handleChange = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <input
        type="text"
        className="form-control w-50"
        placeholder={placeholder}
        onChange={handleChange}
      />

      {showAdd && (
        <button className="btn btn-primary ms-2" onClick={onAdd}>
          <i className="bi bi-plus-lg me-1" /> {addLabel}
        </button>
      )}
    </div>
  );
};

SearchAndAdd.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  addLabel: PropTypes.string,
  showAdd: PropTypes.bool,
};

export default SearchAndAdd;

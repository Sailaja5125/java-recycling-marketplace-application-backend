import React, { useState } from 'react';
import { format } from 'date-fns';
import './Dashboard.css';

const PickupForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    address: '',
    materials: [],
    quantity: '',
    pickupTime: '',
  });
  const [materialInput, setMaterialInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleAddMaterial = () => {
    if (materialInput.trim() && !formData.materials.includes(materialInput.trim())) {
      setFormData({
        ...formData,
        materials: [...formData.materials, materialInput.trim()],
      });
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (material) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((m) => m !== material),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    if (formData.materials.length === 0) {
      setError('Please add at least one material type');
      return;
    }

    if (!formData.quantity || formData.quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    const submitData = {
      address: formData.address,
      materials: formData.materials,
      quantity: parseInt(formData.quantity),
      pickupTime: formData.pickupTime ? new Date(formData.pickupTime) : null,
    };

    try {
      await onSubmit(submitData);
      // Reset form
      setFormData({
        address: '',
        materials: [],
        quantity: '',
        pickupTime: '',
      });
      setMaterialInput('');
    } catch (err) {
      // Error handled by parent
    }
  };

  const minDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <form onSubmit={handleSubmit} className="pickup-form" noValidate>
      {error && (
        <div className="form-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Pickup Address <span className="required">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="form-textarea"
          rows="3"
          required
          aria-required="true"
          placeholder="Enter your full address for pickup"
        />
      </div>

      <div className="form-group">
        <label htmlFor="materials" className="form-label">
          Materials to Recycle <span className="required">*</span>
        </label>
        <div className="materials-input-group">
          <input
            type="text"
            id="materials"
            value={materialInput}
            onChange={(e) => setMaterialInput(e.target.value)}
            className="form-input"
            placeholder="e.g., Plastic bottles, Cardboard, Glass"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMaterial();
              }
            }}
            aria-label="Add material type"
          />
          <button
            type="button"
            onClick={handleAddMaterial}
            className="btn-add-material"
            aria-label="Add material to list"
          >
            Add
          </button>
        </div>
        {formData.materials.length > 0 && (
          <div className="materials-list" role="list" aria-label="Selected materials">
            {formData.materials.map((material, index) => (
              <span key={index} className="material-tag" role="listitem">
                {material}
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(material)}
                  className="material-remove"
                  aria-label={`Remove ${material}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="quantity" className="form-label">
          Quantity (kg) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="form-input"
          min="1"
          required
          aria-required="true"
          placeholder="Enter weight in kilograms"
        />
      </div>

      <div className="form-group">
        <label htmlFor="pickupTime" className="form-label">
          Preferred Pickup Time (Optional)
        </label>
        <input
          type="datetime-local"
          id="pickupTime"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
          className="form-input"
          min={minDate}
        />
        <small className="form-help">
          If not specified, pickup will be scheduled for tomorrow
        </small>
      </div>

      <button
        type="submit"
        className="btn-submit"
        disabled={loading}
        aria-label={loading ? 'Submitting pickup request...' : 'Submit pickup request'}
      >
        {loading ? 'Submitting...' : 'Schedule Pickup'}
      </button>
    </form>
  );
};

export default PickupForm;

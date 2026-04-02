import React, { useState } from 'react';
import './Dashboard.css';

const AddProductForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productDetails: '',
    price: '',
    quantity: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit now that we use Cloudinary
        setError('Image file is too large (max 5MB)');
        return;
      }
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.productName.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (!formData.quantity || formData.quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!selectedFile) {
      setError('Please upload a product image');
      return;
    }

    const submitData = new FormData();
    submitData.append('productName', formData.productName);
    submitData.append('productDetails', formData.productDetails);
    submitData.append('price', formData.price);
    submitData.append('quantity', formData.quantity);
    submitData.append('image', selectedFile);

    try {
      await onSubmit(submitData);
      // Reset form
      setFormData({
        productName: '',
        productDetails: '',
        price: '',
        quantity: '',
        imageUrl: '',
      });
      setImagePreview(null);
      setSelectedFile(null);
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pickup-form" noValidate>
      {error && (
        <div className="form-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="productName" className="form-label">
          Product Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="form-input"
          required
          aria-required="true"
          placeholder="e.g., Recycled Notebook"
        />
      </div>

      <div className="form-group">
        <label htmlFor="productDetails" className="form-label">
          Product Details
        </label>
        <textarea
          id="productDetails"
          name="productDetails"
          value={formData.productDetails}
          onChange={handleChange}
          className="form-textarea"
          rows="3"
          placeholder="Describe your product..."
        />
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="price" className="form-label">
            Price (Points) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            min="1"
            required
            aria-required="true"
            placeholder="0"
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quantity" className="form-label">
            Quantity <span className="required">*</span>
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
            placeholder="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="imageUpload" className="form-label">
          Product Image
        </label>
        <div className="image-upload-wrapper" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
            style={{ flex: 1 }}
          />
          {imagePreview && (
            <div className="image-preview" style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        <small className="form-help">Upload a clear photo of the product (Max 2MB)</small>
      </div>

      <button
        type="submit"
        className="btn-submit"
        disabled={loading}
        aria-label={loading ? 'Adding product...' : 'Add Product'}
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProductForm;

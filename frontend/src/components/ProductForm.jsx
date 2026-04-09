import { useState } from 'react';

const ProductForm = ({ onSubmit, initial, onCancel }) => {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [stock, setStock] = useState(initial?.stock || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, price: Number(price), stock: Number(stock) });
    if (!initial) {
      setName('');
      setPrice('');
      setStock('');
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit Product' : 'Add Product'}</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" step="0.01" min="0" required />
      <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" type="number" min="0" required />
      <div className="row">
        <button type="submit">Save</button>
        {initial && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default ProductForm;

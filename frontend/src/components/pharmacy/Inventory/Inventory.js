import React, { useState, useEffect } from 'react';
import pharmacyAPI from '../../../services/api/pharmacy';
import './Inventory.css';

const Inventory = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Search and Sort State
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'name',
        order: 'asc'
    });

    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        composition: '',
        category: 'other',
        form: 'tablet',
        strength: '',
        stock: '',
        price: '',
        expiryDate: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null); // Track editing state
    const [message, setMessage] = useState('');

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchInventory();
        }, 500); // Debounce search
        return () => clearTimeout(debounce);
    }, [filters]);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await pharmacyAPI.getInventory(filters);
            setMedicines(response.data.medicines || []);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isEditMode = !!editingId;

    const handleEdit = (medicine) => {
        setEditingId(medicine._id || medicine.id);
        setFormData({
            name: medicine.name,
            manufacturer: medicine.manufacturer,
            composition: medicine.composition || '',
            category: medicine.category || 'other',
            form: medicine.form || 'tablet',
            strength: medicine.strength || '',
            stock: medicine.stock,
            price: medicine.price,
            expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
            description: medicine.description || ''
        });
        setShowAddModal(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            manufacturer: '',
            composition: '',
            category: 'other',
            form: 'tablet',
            strength: '',
            stock: '',
            price: '',
            expiryDate: '',
            description: ''
        });
        setShowAddModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await pharmacyAPI.updateMedicine(editingId, formData);
                setMessage('Medicine updated successfully!');
            } else {
                await pharmacyAPI.addMedicine(formData);
                setMessage('Medicine added successfully!');
            }

            resetForm();
            fetchInventory();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save medicine:', error);
            const errMsg = error.response?.data?.message || 'Failed to save medicine.';
            setMessage(errMsg);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await pharmacyAPI.deleteMedicine(id);
                fetchInventory();
            } catch (error) {
                console.error('Failed to delete medicine:', error);
            }
        }
    };

    return (
        <div className="inventory">
            <div className="header-actions">
                <h2>Inventory Management</h2>
                <div className="controls">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search medicines..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="search-input"
                    />
                    <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="sort-select">
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="expiryDate">Expiry Date</option>
                        <option value="stock">Stock</option>
                    </select>
                    <select name="order" value={filters.order} onChange={handleFilterChange} className="sort-select">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <button className="btn-add" onClick={() => { resetForm(); setShowAddModal(true); }}>Add Medicine</button>
                </div>
            </div>

            {message && <div className={`alert-message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isEditMode ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Medicine Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Generic Name / Composition</label>
                                <input type="text" name="composition" value={formData.composition} onChange={handleInputChange} required placeholder="e.g. Paracetamol 500mg" />
                            </div>
                            <div className="form-group">
                                <label>Manufacturer</label>
                                <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                                        <option value="analgesic">Analgesic</option>
                                        <option value="antibiotic">Antibiotic</option>
                                        <option value="antihistamine">Antihistamine</option>
                                        <option value="antacid">Antacid</option>
                                        <option value="vitamin">Vitamin</option>
                                        <option value="cardiovascular">Cardiovascular</option>
                                        <option value="diabetes">Diabetes</option>
                                        <option value="respiratory">Respiratory</option>
                                        <option value="gastrointestinal">Gastrointestinal</option>
                                        <option value="dermatological">Dermatological</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Form</label>
                                    <select name="form" value={formData.form} onChange={handleInputChange} required>
                                        <option value="tablet">Tablet</option>
                                        <option value="capsule">Capsule</option>
                                        <option value="syrup">Syrup</option>
                                        <option value="injection">Injection</option>
                                        <option value="ointment">Ointment</option>
                                        <option value="cream">Cream</option>
                                        <option value="drops">Drops</option>
                                        <option value="inhaler">Inhaler</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Strength</label>
                                    <input type="text" name="strength" value={formData.strength} onChange={handleInputChange} required placeholder="e.g. 500mg" />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn-submit">{isEditMode ? 'Update Medicine' : 'Add Medicine'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Manufacturer</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Expiry Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.length > 0 ? (
                            medicines.map(med => (
                                <tr key={med._id || med.id}>
                                    <td>{med.name}</td>
                                    <td>{med.manufacturer}</td>
                                    <td>
                                        <span className={`stock-badge ${med.stock < 100 ? 'low' : 'good'}`}>
                                            {med.stock}
                                        </span>
                                    </td>
                                    <td>₹{Number(med.price).toFixed(2)}</td>
                                    <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(med)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(med._id || med.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No medicines found. Add one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Inventory;

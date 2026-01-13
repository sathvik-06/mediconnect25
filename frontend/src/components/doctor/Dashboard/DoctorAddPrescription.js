import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../../services/api/prescriptions';
import api from '../../../services/api/config';
import './DoctorAddPrescription.css';

const DoctorAddPrescription = ({ onPrescriptionAdded, editingPrescription, onCancelEdit }) => {
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        diagnosis: '',
        notes: ''
    });
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: '', duration: '', notes: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (editingPrescription) {
            setFormData({
                patientId: editingPrescription.patient?._id || editingPrescription.patient, // handle populated or ID
                diagnosis: editingPrescription.diagnosis,
                notes: editingPrescription.notes || ''
            });
            // Ensure medicines have all fields
            const mappedMeds = editingPrescription.medicines.map(m => ({
                name: m.name || '',
                dosage: m.dosage || '',
                frequency: m.frequency || '',
                duration: m.duration || '',
                notes: m.notes || ''
            }));
            setMedicines(mappedMeds.length ? mappedMeds : [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
        } else {
            // Reset if null
            setFormData({ patientId: '', diagnosis: '', notes: '' });
            setMedicines([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
        }
    }, [editingPrescription]);

    const fetchPatients = async () => {
        setLoadingPatients(true);
        try {
            const response = await api.get('/doctors/patients?all=true');
            if (response.success) {
                setPatients(response.patients);
            }
        } catch (err) {
            console.error('Failed to fetch patients', err);
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
    };

    const removeMedicine = (index) => {
        const newMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(newMedicines);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.patientId) throw new Error('Please select a patient');
            if (medicines.some(m => !m.name || !m.dosage)) throw new Error('Please fill in medicine name and dosage');

            const payload = {
                patientId: formData.patientId,
                diagnosis: formData.diagnosis,
                notes: formData.notes,
                medicines: medicines
            };

            await prescriptionService.createPrescription(payload);

            alert('Prescription created successfully');

            setFormData({ patientId: '', diagnosis: '', notes: '' });
            setMedicines([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);

            if (onPrescriptionAdded) onPrescriptionAdded();

        } catch (err) {
            setError(err.message || 'Failed to create prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-prescription-card">
            <div className="card-header">
                <h3>{editingPrescription ? 'Edit Prescription' : 'New Prescription'}</h3>
                {editingPrescription && (
                    <button type="button" onClick={onCancelEdit} className="btn-cancel-edit">
                        Cancel Edit
                    </button>
                )}
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="prescription-form">
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Select Patient</label>
                        <select
                            key={patients.length} /* Force re-render when patients load */
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            required
                            disabled={loadingPatients}
                        >
                            <option value="">-- Choose Patient --</option>
                            {patients.map(patient => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.name} ({patient.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group half-width">
                        <label>Diagnosis</label>
                        <input
                            type="text"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            placeholder="e.g. Viral Fever"
                            required
                        />
                    </div>
                </div>

                <div className="medicines-table-container">
                    <label className="section-label">Medicines</label>
                    <table className="medicines-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Medicine Name</th>
                                <th style={{ width: '15%' }}>Dosage</th>
                                <th style={{ width: '15%' }}>Frequency</th>
                                <th style={{ width: '15%' }}>Duration</th>
                                <th style={{ width: '20%' }}>Notes</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((medicine, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            placeholder="Name"
                                            value={medicine.name}
                                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="500mg"
                                            value={medicine.dosage}
                                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="1-0-1"
                                            value={medicine.frequency}
                                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="5 days"
                                            value={medicine.duration}
                                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="After food"
                                            value={medicine.notes}
                                            onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        {medicines.length > 1 && (
                                            <button type="button" onClick={() => removeMedicine(index)} className="btn-delete-medicine" title="Delete Medicine">
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addMedicine} className="btn-add-row">
                        + Add Medicine
                    </button>
                </div>

                <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Instructions for the patient..."
                        className="notes-area"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-create" disabled={loading}>
                        {loading ? 'Saving...' : (editingPrescription ? 'Update Prescription' : 'Create Prescription')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorAddPrescription;

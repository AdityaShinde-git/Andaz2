import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
const AddDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: '',
    specialty: '',
    location: '',
    experience: '',
    rating: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validateForm = () => {
    const errors = {};
    if (!doctor.name.trim()) errors.name = 'Name is required.';
    if (!doctor.specialty.trim()) errors.specialty = 'Specialty is required.';
    if (!doctor.location.trim()) errors.location = 'Location is required.';
    if (!doctor.experience || isNaN(doctor.experience)) errors.experience = 'Must be a valid number.';
    if (!doctor.rating || isNaN(doctor.rating) || doctor.rating < 1 || doctor.rating > 5)
      errors.rating = 'Rating must be between 1 and 5.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await axios.post('https://doctorsassignment-backend.onrender.com/add-doctor', {
        ...doctor,
        experience: Number(doctor.experience),
        rating: Number(doctor.rating),
      });

      setSuccessMessage('Doctor has been added successfully.');
      setErrorMessage('');
      setDoctor({ name: '', specialty: '', location: '', experience: '', rating: '' });
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (

    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <Head>
        <title>Add/Registeration for Doctor | Health Finder</title>
        <meta name="description" content="Search and filter top-rated doctors by specialty and location." />
        <link rel="canonical" href="https://andaz2.onrender.com/add-doctor" />
      </Head>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 6px 30px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '650px',
        transition: 'all 0.3s ease-in-out'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.75rem', color: '#1f2937', textAlign: 'center' }}>
          Add a New Doctor
        </h1>

        {successMessage && (
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[{ name: 'name', label: 'Full Name' }, { name: 'specialty', label: 'Specialty' }, { name: 'location', label: 'Location' }, { name: 'experience', label: 'Experience (years)', type: 'number' }, { name: 'rating', label: 'Rating (1-5)', type: 'number' }].map(({ name, label, type = 'text' }) => (
            <div key={name} style={{ marginBottom: '1.5rem' }}>
              <label htmlFor={name} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={doctor[name]}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: fieldErrors[name] ? '1px solid #dc2626' : '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              />
              {fieldErrors[name] && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>{fieldErrors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Add Doctor
          </button>
        </form>

   
    
      </div>
      <Link href="/doctor">
  <button style={{
    padding: '0.75rem 1.5rem',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#2563eb',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'background-color 0.2s ease-in-out'
  }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
  >
    Browse Doctor
  </button>
</Link>

    </div>
  );
};

export default AddDoctor;

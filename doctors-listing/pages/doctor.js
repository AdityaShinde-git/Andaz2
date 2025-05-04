import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ specialty: '', location: '', rating: '', page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://doctorsassignment-backend.onrender.com/list-doctor-with-filter', {
          params: {
            ...filters,
            rating: filters.rating ? Number(filters.rating) : undefined
          },
        });
        const filteredDoctors = response.data.doctors.filter(doc => doc.rating >= (filters.rating ? Number(filters.rating) : 0));
        setDoctors(filteredDoctors);
        setTotal(response.data.total);
      } catch (err) {
        setError('Failed to load doctors. Please try again.');
      }
      setLoading(false);
    };

    fetchDoctors();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setFilters((prevFilters) => ({ ...prevFilters, page: newPage }));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Head>
        <title>Find Top Doctors | Health Finder</title>
        <meta name="description" content="Search and filter top-rated doctors by specialty and location." />
        <link rel="canonical" href="http://localhost:3000/doctors" />

        
      </Head>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": doctors.map((doc, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Physician",
              "name": doc.name,
              "medicalSpecialty": doc.specialty,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": doc.location,
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": doc.rating,
                "reviewCount": 10,
              },
            },
          })),
        })}
      </script>
      <Link href="/add-doctor">
  <button style={{
    padding: '0.75rem 1.5rem',
    position: 'absolute',
    top: '20px',
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
    ➕ Add Doctor
  </button>
</Link>

      <h1 style={{ fontSize: '2.2rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Search Doctors</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          name="specialty"
          placeholder="Specialty"
          value={filters.specialty}
          onChange={handleFilterChange}
          style={{ padding: '0.75rem', width: '250px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          style={{ padding: '0.75rem', width: '250px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        />
        <select
          name="rating"
          value={filters.rating}
          onChange={handleFilterChange}
          style={{ padding: '0.75rem', width: '250px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        >
          <option value="">Minimum Rating</option>
          <option value="1">1 star & up</option>
          <option value="2">2 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="4">4 stars & up</option>
          <option value="5">5 stars only</option>
        </select>
      </div>

      {loading && <p>Loading doctors...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.5rem' }}>
        {doctors.map((doctor) => (
          <li
            key={doctor._id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h2 style={{ fontSize: '1.25rem', color: '#1f2937' }}>{doctor.name}</h2>
            <p style={{ margin: '0.25rem 0' }}><strong>Specialty:</strong> {doctor.specialty}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Location:</strong> {doctor.location}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Experience:</strong> {doctor.experience} years</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Rating:</strong> {doctor.rating}/5</p>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page === 1}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: filters.page === 1 ? '#e5e7eb' : '#2563eb',
            color: filters.page === 1 ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: filters.page === 1 ? 'default' : 'pointer'
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Page {filters.page}</span>
        <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={doctors.length < limit}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '1rem',
            backgroundColor: doctors.length < limit ? '#e5e7eb' : '#2563eb',
            color: doctors.length < limit ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: doctors.length < limit ? 'default' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Doctors;

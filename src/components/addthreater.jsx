import React, { useState } from 'react';
import axios from 'axios';

function AddTheater() {
  const [threater_name, setName] = useState('');
  const [threater_location, setLocation] = useState('');
  const [phone_no, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://moviebookingserver-ojrj.onrender.com/threater/threaterlist', {
        threater_name,
        threater_location,
        phone_no
      });
      alert('Theater added successfully!');
      setName('');
      setLocation('');
      setPhone('');
    } catch (error) {
      console.error('Error adding theater:', error);
      alert('Something went wrong while adding the theater.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Add Theater</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Theater Name"
          value={threater_name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={threater_location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_no}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Theater
        </button>
      </form>
    </div>
  );
}

export default AddTheater;

import { useState } from 'react';
import { useExperiences } from '../hooks/useExperiences';

export default function ExperienceSearch() {
  const { experiences, loading, searchExperiences } = useExperiences();
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    category: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchExperiences(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Experiences</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
              Destination
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="destination"
              name="destination"
              type="text"
              placeholder="City or Location"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date (Optional)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              <option value="tours">Tours</option>
              <option value="food">Food & Dining</option>
              <option value="culture">Culture</option>
              <option value="adventure">Adventure</option>
              <option value="nature">Nature</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Experiences'}
          </button>
        </div>
      </form>

      {experiences.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Available Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★ {exp.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({exp.reviews_count} reviews)</span>
                  </div>
                  <p className="text-gray-600 mb-2">{exp.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Duration: {exp.duration}</p>
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mt-1">
                        {exp.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">${exp.price}</p>
                      <button className="mt-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded text-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

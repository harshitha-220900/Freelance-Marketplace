import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ReviewPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/projects').then(res => {
      const found = res.data.find(p => p.project_id === parseInt(id));
      if (found) setProject(found);
    }).catch(console.error);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Determine reviewee (the other party in the project)
    const revieweeId = user.user_id === project.client_id ? project.freelancer_id : project.client_id;
    
    try {
      await api.post('/reviews', {
        project_id: parseInt(id),
        reviewee_id: revieweeId,
        rating: parseInt(rating),
        comment: comment
      });
      navigate(`/dashboard`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="form-label font-bold text-gray-700">Rating (1-5)</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(star => (
                <label key={star} className="flex items-center gap-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    value={star} 
                    checked={rating === star} 
                    onChange={() => setRating(star)} 
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-xl text-yellow-500 font-bold">★ {star}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group mb-8">
            <label className="form-label font-bold text-gray-700">Public Feedback</label>
            <textarea 
              className="form-input py-2" 
              rows="5"
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              placeholder="What went well? What could be improved?"
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary w-full py-3 font-bold" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;

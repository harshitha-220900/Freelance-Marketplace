import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'client', bio: '', skills: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string' 
          ? detail 
          : Array.isArray(detail) 
            ? detail[0].msg 
            : 'Error signing up'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">Join FreelanceHub</h2>
        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              className={`py-2 px-4 rounded font-bold ${formData.role === 'client' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              style={formData.role === 'client' ? {backgroundColor: 'var(--primary)', color: 'white'} : {}}
              onClick={() => setFormData({...formData, role: 'client'})}
            >I'm a Client</button>
            <button
              type="button"
              className={`py-2 px-4 rounded font-bold ${formData.role === 'freelancer' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              style={formData.role === 'freelancer' ? {backgroundColor: 'var(--primary)', color: 'white'} : {}}
              onClick={() => setFormData({...formData, role: 'freelancer'})}
            >I'm a Freelancer</button>
          </div>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Bio (Optional)</label>
            <textarea name="bio" className="form-input" value={formData.bio} onChange={handleChange} rows="3"></textarea>
          </div>
          {formData.role === 'freelancer' && (
            <div className="form-group">
              <label className="form-label">Skills (Comma separated)</label>
              <input name="skills" type="text" className="form-input" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Python" />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full mt-4">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BidCard = ({ bid, onAccept, isJobOpen, jobOwnerId }) => {
  const { user } = useContext(AuthContext);
  
  const isClientOwner = user?.role === 'client' && user?.user_id === jobOwnerId;
  const canAccept = isClientOwner && isJobOpen && bid.status === 'pending';

  return (
    <div className={`card ${bid.status === 'accepted' ? 'border-primary bg-blue-50' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="m-0 font-bold">Freelancer #{bid.freelancer_id}</h4>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
          bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {bid.status.toUpperCase()}
        </span>
      </div>
      
      <p className="mb-4 text-gray-700">{bid.proposal_text}</p>
      
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <div className="font-bold text-lg">
          ${bid.bid_amount}
        </div>
        
        {canAccept && (
          <button 
            onClick={() => onAccept(bid.bid_id)}
            className="btn btn-primary"
          >
            Accept Bid
          </button>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-400 text-right">
        Submitted: {new Date(bid.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default BidCard;

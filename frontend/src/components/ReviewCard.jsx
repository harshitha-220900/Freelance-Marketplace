import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="card mb-4 border border-gray-200 shadow-sm p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg text-gray-800">
          User #{review.reviewer_id} reviewed User #{review.reviewee_id}
        </div>
        <div className="flex items-center">
          <span className="text-yellow-500 font-bold mr-1 text-xl">★</span>
          <span className="font-bold">{review.rating}/5</span>
        </div>
      </div>
      <p className="text-gray-600 mt-2">{review.comment || "No comment provided."}</p>
      <div className="text-xs text-gray-400 mt-4 text-right">
        {new Date(review.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default ReviewCard;

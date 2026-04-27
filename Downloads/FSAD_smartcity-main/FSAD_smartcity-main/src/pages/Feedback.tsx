import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Feedback() {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // 🔥 FETCH FEEDBACK FROM BACKEND
  const fetchFeedbacks = () => {
    fetch("http://localhost:8080/api/feedback")
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 🔥 SUBMIT FEEDBACK TO BACKEND
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    fetch("http://localhost:8080/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
        message: message
      }),
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Feedback submitted");
        setMessage("");
        setRating(5);
        fetchFeedbacks(); // refresh list
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">

      <h1 className="text-2xl font-bold">City Amenities Feedback</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* RATING */}
          <div className="flex space-x-2">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* MESSAGE */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter feedback..."
            className="w-full border p-2"
          />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Send size={16}/> Submit
          </button>

        </form>
      </div>

      {/* LIST */}
      <div>
        <h2 className="font-bold mb-2">Feedback List</h2>

        {feedbacks.length === 0 ? (
          <p>No feedback yet</p>
        ) : (
          feedbacks.map((f, i) => (
            <div key={i} className="border p-3 mb-2 rounded">
              <p>⭐ {f.rating}</p>
              <p>{f.message}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, PlusCircle } from "lucide-react";
import { getUserFriends } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getUserFriends();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error.message || "Failed to load friends. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchFriends();
    }
  }, [authUser]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Friends</h1>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/add-friends")}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Friends
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {friends.length === 0 ? (
        <div className="text-center py-12">
          <UserRound className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No friends yet</h3>
          <p className="mt-1 text-gray-500">Add some friends to start chatting!</p>
          <div className="mt-6">
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/add-friends")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Friends
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div key={friend._id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-center space-x-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{friend.fullName}</h3>
                    {/* <div className="text-sm text-gray-500">
                      <p>Native: {friend.nativeLanguage}</p>
                      <p>Learning: {friend.learningLanguage}</p>
                    </div> */}
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">Message</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;

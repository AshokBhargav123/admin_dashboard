import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../services/api";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  
  const fetchUser = async () => {
  try {
    const extraUsers =
      JSON.parse(localStorage.getItem("extraUsers")) || [];

    const localUser = extraUsers.find(
      (user) => user.id === Number(id)
    );

    if (localUser) {
      setUser(localUser);
    } else {
      const res = await getUser(id);
      setUser(res.data);
    }

  } catch (err) {
    setError("Failed to fetch user");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="container">
      <button onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className="card">
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website:</strong> {user.website}</p>
        <p><strong>City:</strong> {user.address?.city}</p>
      </div>
    </div>
  );
};

export default UserDetail;
import { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import UserTable from "../components/UserTable";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

useEffect(() => {
  fetchUsers();
}, [location]);


// const fetchUsers = async () => {
//   try {
//     const res = await getUsers();

//     const extraUsers =
//       JSON.parse(localStorage.getItem("extraUsers")) || [];

//     setUsers([...res.data, ...extraUsers]);

//   } catch (err) {
//     setError("Failed to fetch users");
//   } finally {
//     setLoading(false);
//   }
// };

const fetchUsers = async () => {
  try {
    setLoading(true);

    const res = await getUsers();

    const extraUsers =
      JSON.parse(localStorage.getItem("extraUsers")) || [];

    // 🔥 Replace API users if edited in localStorage
    const mergedUsers = res.data.map(apiUser => {
      const localUser = extraUsers.find(
        u => u.id === apiUser.id
      );
      return localUser ? localUser : apiUser;
    });

    // 🔥 Add newly created users (not in API)
    const newUsers = extraUsers.filter(
      u => !res.data.some(api => api.id === u.id)
    );

    setUsers([...mergedUsers, ...newUsers]);

  } catch (err) {
    setError("Failed to fetch users");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="container">
      <div className="top-bar">
        <button onClick={() => navigate("/add-user")}>Add User</button>
        <button onClick={() => { logout(); navigate("/"); }}>
          Logout
        </button>
      </div>

      <UserTable users={users} />
    </div>
  );
};

export default Dashboard;
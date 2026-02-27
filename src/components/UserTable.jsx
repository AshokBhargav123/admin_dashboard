import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ users }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // ✅ Safe city extraction (supports both API + local users)
  const cities = [
    ...new Set(
      users
        .map((u) => u.address?.city)
        .filter(Boolean)
    ),
  ];

  // ✅ Filtering + Sorting
  const filtered = users
    .filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      city ? u.address?.city === city : true
    )
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div>
      <div className="filters">
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort {sortAsc ? "DESC" : "ASC"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((user) => (
            <tr key={user.id}>
              {/* View User */}
              <td
                onClick={() => navigate(`/users/${user.id}`)}
                style={{ cursor: "pointer" }}
              >
                {user.name}
              </td>

              <td>{user.email}</td>
              <td>{user.address?.city || "N/A"}</td>

              {/* Edit Button */}
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents row click
                    navigate(`/edit-user/${user.id}`);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
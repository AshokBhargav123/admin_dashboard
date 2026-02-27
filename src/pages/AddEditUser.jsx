import { useState, useEffect } from "react";
import { createUser, updateUser, getUser } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const AddEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
  });

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isEdit) {
      getUser(id)
        .then((res) => {
          setForm({
            name: res.data.name || "",
            email: res.data.email || "",
            city: res.data.address?.city || "",
          });
        })
        .catch(() => setErrorMsg("Failed to fetch user"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!form.name || !form.email || !form.city) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      let res;

      if (isEdit) {
        // PUT simulation
        res = await updateUser(id, {
          name: form.name,
          email: form.email,
          address: { city: form.city },
        });

        const extraUsers =
          JSON.parse(localStorage.getItem("extraUsers")) || [];

        const updatedUsers = extraUsers.map((user) =>
          user.id === Number(id)
            ? {
                ...user,
                name: form.name,
                email: form.email,
                address: { city: form.city },
              }
            : user
        );

        localStorage.setItem(
          "extraUsers",
          JSON.stringify(updatedUsers)
        );

        setMessage("User updated successfully!");
      } else {
        // POST simulation
        res = await createUser({
          name: form.name,
          email: form.email,
          address: { city: form.city },
        });

        const extraUsers =
          JSON.parse(localStorage.getItem("extraUsers")) || [];

        const newUser = {
          ...res.data,
          address: { city: form.city },
        };

        localStorage.setItem(
          "extraUsers",
          JSON.stringify([...extraUsers, newUser])
        );

        setMessage("User created successfully!");
      }

      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (error) {
      setErrorMsg("Something went wrong");
    }
  };

  return (
    <div className="center">
      <form onSubmit={handleSubmit} className="card">
        <h2>{isEdit ? "Edit User" : "Add User"}</h2>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <input
          value={form.name}
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          value={form.email}
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          value={form.city}
          placeholder="City"
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <button type="submit">
          {isEdit ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default AddEditUser;
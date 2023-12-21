import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCauseAreas } from "../services/causeAreaService";
import { RetrieveUser } from "../services/userService";

export const EditUser = () => {
  const [causes, setCauses] = useState([]);
  const [chosenCauses, updateChosen] = useState(new Set());
  const [editedUser, setEditedUser] = useState({});

  const { userId } = useParams();
  const navigate = useNavigate();

  const handleCauseChosen = (cause) => {
    const copy = new Set(chosenCauses);
    copy.has(cause.id) ? copy.delete(cause.id) : copy.add(cause.id);
    updateChosen(copy);
  };

  useEffect(() => {
    RetrieveUser(userId).then((obj) => {
      setEditedUser(obj);
      let cause_area_id = [];
      const cause_areas = obj.cause_area;
      cause_areas.map((obj) => cause_area_id.push(obj.id));
      updateChosen(new Set(cause_area_id));
    });

    getCauseAreas().then((obj) => {
      setCauses(obj);
    });
  }, []);

  const handleInputChange = (event) => {
    setEditedUser({ ...editedUser, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(`http://localhost:8000/volunteers/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("volunteer_token")).token
        }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...editedUser,
        cause_area: Array.from(chosenCauses),
        user: editedUser.user.id,
      }),
    });
    navigate(`/`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-4 w-9/12 bg-sky-700/80 px-6 rounded-md border border-white/60"
    >
      <header>
        <div className="text-3xl font-bold text-white my-4">
          Edit Your Profile
        </div>
      </header>
      <fieldset>
        <div>
          <input
            name="image_url"
            placeholder="Image URL"
            value={editedUser.profile_image_url}
            className="input-text w-[512px]"
            type="text"
            onChange={handleInputChange}
          />
        </div>
      </fieldset>
      <fieldset>
        <div>
          <textarea
            name="bio"
            className="input-text w-[512px] h-[128px]"
            placeholder="bio"
            value={editedUser.bio}
            onChange={handleInputChange}
          />
        </div>
      </fieldset>
      <fieldset className="flex flex-wrap gap-4">
        {causes.map((c) => (
          <div className="flex items-center" key={c.id}>
            <input
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              type="checkbox"
              checked={chosenCauses.has(c.id)}
              onChange={() => {
                handleCauseChosen(c);
              }}
            />
            <div className="ms-2 text-sm text-white">{c.label}</div>
          </div>
        ))}
      </fieldset>
      <button type="submit" className="btn-edit mb-4">
        Save Changes
      </button>
    </form>
  );
};

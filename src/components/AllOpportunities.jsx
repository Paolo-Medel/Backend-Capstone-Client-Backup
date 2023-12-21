import { useEffect, useState } from "react";
import {
  DeleteOpportunity,
  GetOpportunities,
} from "../services/opportunitiesService";
import { NavLink } from "react-router-dom";
import { RetrieveUser } from "../services/userService";

export const AllOpportunities = () => {
  const [posts, setPosts] = useState();
  const [user, setUser] = useState({});
  const [chosenFavorite, setChosenFavorite] = useState(new Set());
  const [chosenCauses, updateChosen] = useState(new Set());

  useEffect(() => {
    GetOpportunities().then((data) => {
      const approvedOpportunities = data.filter(
        (opportunity) => opportunity.approved
      );
      setPosts(approvedOpportunities);
    });

    const volunteer_object = JSON.parse(
      localStorage.getItem("volunteer_token")
    );

    RetrieveUser(volunteer_object.volunteer_user_id).then((obj) => {
      setUser(obj);
      let favorite_ids = [];
      const favorites = obj.favorite;
      favorites.map((obj) => favorite_ids.push(obj.id));
      setChosenFavorite(new Set(favorite_ids));

      let cause_area_id = [];
      const cause_areas = obj.cause_area;
      cause_areas.map((obj) => cause_area_id.push(obj.id));
      updateChosen(new Set(cause_area_id));
    });
  }, []);

  const handleFavorite = (post) => {
    // event.preventDefault();
    const copy = new Set(chosenFavorite);
    copy.has(post.id) ? copy.delete(post.id) : copy.add(post.id);
    setChosenFavorite(copy);
  };

  const addFavorite = async () => {
    await fetch(
      `http://localhost:8000/volunteers/${
        JSON.parse(localStorage.getItem("volunteer_token")).volunteer_user_id
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: `Token ${
            JSON.parse(localStorage.getItem("volunteer_token")).token
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          favorite: Array.from(chosenFavorite),
          cause_area: Array.from(chosenCauses),
          user: user.user.id,
        }),
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div>
        {user.is_business ? (
          <NavLink to={"/CreateOpportunity"}>
            <button className="btn-edit">Create New Opportunity</button>
          </NavLink>
        ) : (
          <div>
            <button
              className="btn-edit"
              onClick={async () => {
                await addFavorite();
                window.alert("Favorites added to Profile Page!");
              }}
            >
              Add Favorites
            </button>
          </div>
        )}
      </div>
      <div>
        {posts?.map((post) => {
          return (
            <div key={post.id} className="border border-dashed">
              <NavLink to={`/Opportunity/${post.id}`}>
                <div>{post.title}</div>
              </NavLink>
              <div>{post.content}</div>
              <div>{post.address}</div>
              <div>{post.publication_date}</div>
              <NavLink to={`/Profile/${post.user.id}`}>
                <div>{post.user.user.author_name}</div>
              </NavLink>
              <div>
                {user.is_business && post.is_owner ? (
                  <div className="flex">
                    <NavLink to={`/EditOpportunity/${post.id}`}>
                      <button className="btn-edit">Edit</button>
                    </NavLink>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        DeleteOpportunity(post.id);
                        window.location.reload();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {user.is_business ? (
                  <></>
                ) : (
                  <fieldset>
                    <input
                      className="btn-edit"
                      checked={chosenFavorite.has(post.id)}
                      value={post.id}
                      type="checkbox"
                      onChange={() => {
                        handleFavorite(post);
                      }}
                    />
                    <label>Favorite</label>
                  </fieldset>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

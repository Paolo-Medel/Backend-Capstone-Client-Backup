import { useEffect, useState } from "react";
import {
  DeleteOpportunity,
  GetOpportunities,
  RetrieveOpportunities,
} from "../services/opportunitiesService";
import { NavLink } from "react-router-dom";
import { RetrieveUser } from "../services/userService";

export const AllOpportunities = () => {
  const [posts, setPosts] = useState();
  const [user, setUser] = useState({});
  const [editUser, setEditUser] = useState({});

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
      setEditUser(obj);
    });
  }, []);

  const addFavorite = async (event) => {
    event.preventDefault();

    const finalValue = {
      user: editUser.user.id,
      bio: editUser.bio,
      profile_image_url: editUser.profile_image_url,
      cause_area: editUser.cause_area.map((obj) => {
        return obj.id;
      }),
      favorite: editUser.favorite.map((obj) => {
        return obj.id;
      }),
    };

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
        body: JSON.stringify(finalValue),
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
            <button className="btn-edit">Filter by Cause Area</button>
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
                  <button
                    className="btn-edit"
                    value={post.id}
                    onClick={async (event) => {
                      const copy = { ...editUser };
                      copy.favorite.push(
                        await RetrieveOpportunities(
                          parseInt(event.target.value)
                        ).then((obj) => {
                          return obj;
                        })
                      );
                      setEditUser(copy);
                      addFavorite(event);
                    }}
                  >
                    Favorite
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

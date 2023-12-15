import { useEffect, useState } from "react";
import {
  DeleteOpportunity,
  RetrieveOpportunities,
} from "../services/opportunitiesService";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { RetrieveUser } from "../services/userService";

export const OpportunityDetails = () => {
  const [opportunity, setOpportunity] = useState();
  const [user, setUser] = useState({});
  const [editUser, setEditUser] = useState({});
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    RetrieveOpportunities(postId).then((obj) => {
      setOpportunity(obj);
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
        <h1>{opportunity?.title}</h1>
        <img
          src={opportunity?.image_url}
          alt="Volunteer Img"
          className="max-h-64 max-w-xl"
        ></img>
        <div>{opportunity?.content}</div>
        <div>{opportunity?.address}</div>
        <NavLink to={`/Profile/${opportunity?.user.id}`}>
          <div>{opportunity?.user.user.author_name}</div>
        </NavLink>
      </div>
      <div>
        {user.is_business && opportunity?.is_owner ? (
          <div className="flex">
            <NavLink to={`/EditOpportunity/${opportunity?.id}`}>
              <button className="btn-edit">Edit</button>
            </NavLink>
            <button
              className="btn-edit"
              onClick={() => {
                DeleteOpportunity(opportunity?.id);
                navigate(-1);
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      {user.is_business ? (
        <></>
      ) : (
        <>
          <button
            className="btn-edit"
            value={opportunity?.id}
            onClick={async (event) => {
              const copy = { ...editUser };
              copy.favorite.push(
                await RetrieveOpportunities(parseInt(event.target.value)).then(
                  (obj) => {
                    return obj;
                  }
                )
              );
              setEditUser(copy);
              addFavorite(event);
            }}
          >
            Favorite
          </button>
          <button className="btn-edit">Express Interest</button>
        </>
      )}
      <div className="flex flex-col">
        {user.is_business &&
        opportunity?.is_owner &&
        opportunity?.interested_volunteers?.length >= 1 ? (
          opportunity.interest_volunteers?.map((obj) => {
            return (
              <>
                <h1>Interest Volunteers</h1>
                <div>{obj.interested_volunteers}</div>
              </>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

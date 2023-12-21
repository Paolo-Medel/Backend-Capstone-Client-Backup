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
  const [chosenCauses, setChosenCauses] = useState();
  const [interestedVolunteer, setInterestedVolunteer] = useState(new Set());
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    RetrieveOpportunities(postId).then((obj) => {
      setOpportunity(obj);
      let interested_array = [];
      const interested = obj.interested_volunteers;
      interested.map((obj) => {
        interested_array.push(obj.id);
      });
      setInterestedVolunteer(new Set(interested_array));

      let cause_area_id = [];
      const cause_areas = obj.cause_area;
      cause_areas.map((obj) => cause_area_id.push(obj.id));
      setChosenCauses(new Set(cause_area_id));
    });

    const volunteer_object = JSON.parse(
      localStorage.getItem("volunteer_token")
    );
    RetrieveUser(volunteer_object.volunteer_user_id).then((obj) => {
      setUser(obj);
    });
  }, []);

  const handleVolunteer = () => {
    // event.preventDefault();
    const copy = new Set(interestedVolunteer);
    copy.has(user.id) ? copy.delete(user.id) : copy.add(user.id);
    setInterestedVolunteer(copy);
  };

  const handleSubmit = async () => {
    await fetch(`http://localhost:8000/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("volunteer_token")).token
        }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...opportunity,
        cause_area: Array.from(chosenCauses),
        user: opportunity.user.id,
        interested_volunteers: Array.from(interestedVolunteer),
      }),
    });
    navigate(`/`);
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
          <>
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
            <div>
              {opportunity.interested_volunteers?.map((obj) => {
                return (
                  <div key={obj.id}>
                    <h1>Interested Volunteers</h1>
                    <div className="flex flex-row ">
                      <div>{obj.user.author_name}</div>
                      <div>{obj.user.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {user.is_business ? (
        <></>
      ) : (
        <>
          <fieldset>
            <input
              className="btn-edit"
              type="checkbox"
              onChange={() => {
                handleVolunteer();
              }}
              checked={interestedVolunteer.has(user.id)}
            />
            <label>Are you Interested in Volunteering?</label>
          </fieldset>
          <button
            className="btn-edit"
            onClick={async () => {
              await handleSubmit();
            }}
          >
            Send Contact info to Company!
          </button>
        </>
      )}
      <div className="flex flex-col">
        {opportunity?.is_owner === true ? (
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

// &&
//         opportunity?.interested_volunteers?.length >= 1

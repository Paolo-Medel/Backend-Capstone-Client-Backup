import { useEffect, useState } from "react";
import { RetrieveOpportunities } from "../services/opportunitiesService";
import { NavLink, useParams } from "react-router-dom";

export const OpportunityDetails = () => {
  const [opportunity, setOpportunity] = useState();
  const { postId } = useParams();

  useEffect(() => {
    RetrieveOpportunities(postId).then((obj) => {
      setOpportunity(obj);
    });
  }, []);

  return (
    <>
      <div>
        <div>{opportunity?.title}</div>
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
    </>
  );
};

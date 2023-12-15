import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RetrieveUser } from "../services/userService";

export const UserDetails = () => {
  const [user, setUser] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    RetrieveUser(userId).then((obj) => {
      setUser(obj);
    });
  }, []);

  return (
    <div className="flex flex-col">
      <h1>Profile!</h1>
      <div key={user.id}>
        <img src={user.profile_image_url} alt="Profile img"></img>
        <div>{user.bio}</div>
        <div>{user.user?.full_name}</div>
      </div>
      <div>
        <h1>Favs!</h1>
        <div>
          {user.favorite?.map((obj) => {
            return (
              <div key={obj.id} className="border border-dotted">
                <div>{obj.title}</div>
                <div>{obj.content}</div>
                <div>{obj.address}</div>
                <div>{obj.publication_date}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { RetrieveUser } from "../services/userService";
import { GetOpportunities } from "../services/opportunitiesService";

export const UserDetails = () => {
  const [user, setUser] = useState({});
  const [post, setPost] = useState();
  const { userId } = useParams();
  const local_storage = JSON.parse(localStorage.getItem("volunteer_token"));
  const local_storage_volunteer_id = local_storage.volunteer_user_id;

  useEffect(() => {
    RetrieveUser(userId).then((obj) => {
      setUser(obj);
    });
  }, [userId]);

  useEffect(() => {
    GetOpportunities().then((opportunity) => {
      opportunity.map((obj) => {
        let post_array = [];
        if (obj.user.id === user.id) {
          post_array.push(obj);
          setPost(post_array);
        }
      });
    });
  }, [user]);

  return (
    <div className="flex flex-col">
      <h1>Profile!</h1>
      <div key={user.id}>
        <img
          className="max-w-xl"
          src={user.profile_image_url}
          alt="Profile img"
        ></img>
        <div>{user.bio}</div>
        <div>{user.user?.full_name}</div>
        {parseInt(userId) === local_storage_volunteer_id ? (
          <NavLink to={`/EditUser/${user.id}`}>
            <button className="btn-edit">Edit User</button>
          </NavLink>
        ) : (
          <></>
        )}
      </div>
      {user.favorite?.length >= 1 ? (
        <div>
          <h1>Favorites</h1>
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
      ) : (
        <></>
      )}
      {user?.is_business ? (
        <>
          <NavLink to={"/CreateOpportunity"}>
            <button className="btn-edit">Create New Opportunity</button>
          </NavLink>
          <h1>Created Posts</h1>
        </>
      ) : (
        <></>
      )}
      {post?.map((post) => (
        <div key={post.id}>
          <div className="border border-dashed">
            <NavLink to={`/Opportunity/${post?.id}`}>
              <div>{post?.title}</div>
            </NavLink>
            <div>{post?.content}</div>
            <div>{post?.address}</div>
            <div>{post?.publication_date}</div>
            <NavLink to={`/Profile/${post?.user?.id}`}>
              <div>{post?.user?.user?.author_name}</div>
            </NavLink>
            {post.is_owner ? (
              <NavLink to={`/EditOpportunity/${post.id}`}>
                <button className="btn-edit">edit</button>
              </NavLink>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

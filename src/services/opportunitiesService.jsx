export const GetOpportunities = () => {
  const variable = JSON.parse(localStorage.getItem("volunteer_token"));
  const token = variable.token;
  return fetch("http://localhost:8000/posts", {
    headers: {
      Authorization: `Token ${token}`,
      // Add other headers if needed
    },
  }).then((res) => res.json());
};

export const RetrieveOpportunities = (id) => {
  const variable = JSON.parse(localStorage.getItem("volunteer_token"));
  const token = variable.token;
  return fetch(`http://localhost:8000/posts/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
      // Add other headers if needed
    },
  }).then((res) => res.json());
};

export const DeleteOpportunity = (id) => {
  const variable = JSON.parse(localStorage.getItem("volunteer_token"));
  const token = variable.token;
  return fetch(`http://localhost:8000/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
};

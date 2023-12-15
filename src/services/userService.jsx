export const RetrieveUser = (id) => {
  const variable = JSON.parse(localStorage.getItem("volunteer_token"));
  const token = variable.token;
  return fetch(`http://localhost:8000/volunteers/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
      // Add other headers if needed
    },
  }).then((res) => res.json());
};

import api from "./api";

// Send customer message
export const sendComment = async (data) => {
  const res = await api.post("/comments", data);
  return res.data;
};

// Admin: get all comments
export const getComments = async () => {
  const res = await api.get("/comments");
  return res.data;
};

// Admin: delete comment
export const deleteComment = async (id) => {
  const res = await api.delete(`/comments/${id}`);
  return res.data;
};

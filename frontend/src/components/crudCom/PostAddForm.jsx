import React from "react";

const PostAddForm = ({
  data,
  handleChange,
  handleSubmit,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={data.title}
        onChange={handleChange}
      />

      <input
        type="text"
        name="subtitle"
        placeholder="Subtitle"
        value={data.subtitle}
        onChange={handleChange}
      />

      <textarea
        name="content"
        placeholder="Content"
        value={data.content}
        onChange={handleChange}
      />

      <button type="submit">
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default PostAddForm;
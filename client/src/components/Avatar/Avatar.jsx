import React from "react";
import { useSelector } from "react-redux";

const Avatar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <img
        src={
          user.profile_photo
            ? user.profile_photo
            : "https://us.123rf.com/450wm/tanyadanuta/tanyadanuta2006/tanyadanuta200600026/tanyadanuta200600026.jpg?ver=6"
        }
        alt=""
      />
    </>
  );
};

export default Avatar;

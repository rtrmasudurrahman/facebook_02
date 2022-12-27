import React from "react";
import Avatar from "../Avatar/Avatar";
import CreatePost from "../CreatePost/CreatePost";
import UserPost from "../UserPost/UserPost";

const Timeline = () => {
  return (
    <>
      <div class="fb-home-timeline-area">
        <div class="fb-home-timeline">
          <CreatePost />

          <UserPost />
        </div>
      </div>
    </>
  );
};

export default Timeline;

import React from "react";
import Avatar from "../Avatar/Avatar";

const CreatePost = () => {
  return (
    <div>
      <div class="create-post">
        <div class="create-post-header">
          <Avatar />
          <button>Whats on your mind ? </button>
        </div>
        <div class="divider-0"></div>
        <div class="create-post-footer">
          <ul>
            <li>
              <div class="post-icon"></div>
              <span>Live Video</span>
            </li>
            <li>
              <div class="post-icon"></div> Photo/video
            </li>
            <li>
              <div class="post-icon"></div> Feeling/ctivity
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

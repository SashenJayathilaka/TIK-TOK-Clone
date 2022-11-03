import React from "react";
import moment from "moment";

const Links = () => {
  return (
    <div className="links">
      <div>
        <div className="link">
          <a href="#">About</a>
          <a href="#">Newsroom</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
          <a href="#">ByteDance</a>
          <a href="#">About</a>
          <a href="#">Newsroom</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
          <a href="#">ByteDance</a>
        </div>
        <div className="copyright">
          <h6>&copy; {moment().format("YYYY")} TikTok</h6>
        </div>
      </div>
    </div>
  );
};

export default Links;

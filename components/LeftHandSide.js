import React from "react";

import Btns from "./Btns";
import Tags from "./Tags";
import Links from "./Links";

const LeftHandSide = () => {
  return (
    <div className="left">
      <Btns />
      <Tags />
      <Links />
    </div>
  );
};

export default LeftHandSide;

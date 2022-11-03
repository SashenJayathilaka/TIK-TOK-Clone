import React from "react";
import { motion } from "framer-motion";

import Btns from "./Btns";
import Tags from "./Tags";
import Links from "./Links";

const LeftHandSide = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="left"
    >
      <Btns />
      <Tags />
      <Links />
    </motion.div>
  );
};

export default LeftHandSide;

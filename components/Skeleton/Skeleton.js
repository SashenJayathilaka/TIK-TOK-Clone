import React from "react";
import { motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";

const Skeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex justify-center items-center"
    >
      <ThreeDots
        height="500"
        width="500"
        radius="9"
        color="#F778A1"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </motion.div>
  );
};

export default Skeleton;

import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

const UploadeSkeleton = () => {
  return (
    <CirclesWithBar
      height="100"
      width="100"
      color="#F778A1"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      outerCircleColor=""
      innerCircleColor=""
      barColor=""
      ariaLabel="circles-with-bar-loading"
    />
  );
};

export default UploadeSkeleton;

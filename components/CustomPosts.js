import React from "react";

const CustomPosts = ({ video, topic, userId, secondId }) => {
  return (
    <div>
      {userId === secondId && (
        <div>
          <div className="relative w-full h-60 bg-cover bg-center bg-no-repeat">
            <video
              className="rounded-xl h-60 w-[160px] bg-black cursor-pointer"
              type="video/mp4"
              loop
              controls={false}
              muted
              autoPlay
              src={video}
            />
            <div className="absolute bottom-1 left-1 flex gap-1 text-white text-xs items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                />
              </svg>

              <span>{topic}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPosts;

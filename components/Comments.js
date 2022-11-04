import React from "react";
import moment from "moment";

const Comments = ({
  comment,
  setComment,
  sendComment,
  comments,
  loading,
  ownShow,
}) => {
  return (
    <div>
      {comments.length > 0 && (
        <div
          className={
            ownShow
              ? `h-48 overflow-y-scroll scrollbar-hide scrollbar-thumb-black bg-[#FFFAFA] py-2.5 px-2.5 border border-gray-200 border-y-gray-200`
              : `ml-10 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-black`
          }
        >
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-center
            space-x-2 mb-3 ml-10"
            >
              <img
                className="h-7 rounded-full"
                src={comment.data().userImage}
                alt=""
              />
              <p className="text-sm flex-1">
                <span className="font-bold">{comment.data().username} </span>
                {comment.data().comment}
              </p>
              <p className={ownShow ? `pl-10 text-xs` : `pr-5 text-xs`}>
                {moment(
                  new Date(comment.data().timestamp?.seconds * 1000)
                ).fromNow()}
              </p>
            </div>
          ))}
        </div>
      )}
      <form className="flex items-center p-4 px-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-7 mr-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>

        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="border-none flex-1 focus:ring-0 outline-none"
        />
        {loading ? (
          <button type="submit" Name="font-semibold text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            //disabled={!comment.trim()}
            onClick={sendComment}
            className="font-semibold text-blue-400"
          >
            Post
          </button>
        )}
      </form>
    </div>
  );
};

export default Comments;

import { faker } from "@faker-js/faker";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

import { BsFillPlayFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

import { auth, firestore } from "../../firebase/firebase";
import Comments from "../Comments";

const VideoDetail = ({
  caption,
  company,
  video,
  profileImage,
  topic,
  timestamp,
  username,
  userId,
  songName,
  id,
  videoId,
}) => {
  const [user] = useAuthState(auth);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isComOpem, setIsComOpen] = useState(true);
  const [tagCheck, setIsTagCheck] = useState();
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);

  const onVideoClick = () => {
    if (isPlaying) {
      videoRef?.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef?.current?.play();
      setIsPlaying(true);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (comment) {
      setLoading(true);
      try {
        await addDoc(collection(firestore, "posts", id, "comments"), {
          comment: comment,
          username: user?.displayName,
          userImage: user?.photoURL,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Comment field is empty", {
        duration: 3000,
        position: "bottom-left",
        style: {
          background: "#fff",
          color: "#015871",
          fontWeight: "bolder",
          fontSize: "17px",
          padding: "20px",
        },
      });
    }

    setComment("");
    setLoading(false);
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firestore, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [firestore, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(firestore, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [firestore, id]
  );

  useEffect(
    () => setHasLikes(likes.findIndex((like) => like.id === user?.uid) !== -1),
    [likes]
  );

  const likePost = async () => {
    try {
      if (hasLikes) {
        await deleteDoc(doc(firestore, "posts", id, "likes", user?.uid));
      } else {
        await setDoc(doc(firestore, "posts", id, "likes", user?.uid), {
          username: user?.displayName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (topic) {
      const tagCheck = topic.match(/#/g);
      setIsTagCheck(tagCheck);
    }
  }, [topic]);

  return (
    <>
      {videoId === id && (
        <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
          <Toaster />
          <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center bg-gradient-to-r from-gray-900 to-gray-700">
            <div className="opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
              <p className="cursor-pointer " onClick={() => router.back()}>
                <MdOutlineCancel className="text-white text-[35px] hover:opacity-90" />
              </p>
            </div>
            <div className="relative">
              <div className="lg:h-[100vh] h-[60vh]">
                <video
                  ref={videoRef}
                  onClick={onVideoClick}
                  loop
                  src={video}
                  className=" h-full cursor-pointer"
                ></video>
              </div>

              <div className="absolute top-[45%] left-[40%]  cursor-pointer">
                {!isPlaying && (
                  <button onClick={onVideoClick}>
                    <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10  cursor-pointer">
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-white text-3xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-white text-3xl lg:text-4xl" />
                </button>
              )}
            </div>
          </div>
          <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
            <div className="lg:mt-20 mt-10">
              <div
                className="flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer"
                /*    onClick={handleChangePage} */
              >
                <img
                  alt="user-profile"
                  className="rounded-full w-12 h-12"
                  src={profileImage}
                />
                <div>
                  <div className="text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-start">
                    {username} <GoVerified className="text-blue-400 text-xl" />
                  </div>
                  <div className="absolute flex ml-64 top-20 justify-end">
                    <button
                      type="button"
                      className="inline-block px-4 py-1.5 border border-pink-500 text-pink-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                    >
                      Follow
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm">{company}</p>
                    <p className="pr-5 text-xs">
                      {"."}
                      {moment(new Date(timestamp?.seconds * 1000)).fromNow()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-10">
                <p className=" text-md text-gray-600">{caption}</p>
                {tagCheck ? (
                  <p className=" text-md text-gray-600 font-bold">{topic}</p>
                ) : (
                  <p className=" text-md text-gray-600 font-bold">
                    {"#"}
                    {topic}
                  </p>
                )}
              </div>
              <div className="px-10 py-2.5 flex gap-4">
                {isPlaying ? (
                  <img
                    className="w-5 h-5 animate-spin"
                    src="https://cdn2.iconfinder.com/data/icons/digital-and-internet-marketing-3-1/50/109-512.png"
                    alt="image"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                    />
                  </svg>
                )}

                <p className="font-semibold text-sm">{songName}</p>
              </div>
              <div className="mt-5 px-10">
                {user && (
                  <div className="video-icons items-center mt-8 flex justify-start gap-8">
                    <div className="mb-4 flex items-center">
                      {hasLikes ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gray-300 rounded-full px-2 py-2"
                        >
                          <svg
                            onClick={likePost}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 cursor-pointer text-red-500"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gray-300 rounded-full px-2 py-2"
                        >
                          <svg
                            onClick={likePost}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 cursor-pointer"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        </motion.div>
                      )}

                      <p className="text-md font-semibold text-center ml-2">
                        {likes.length}
                      </p>
                    </div>
                    <div className="mb-4 flex items-center">
                      {isComOpem ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gray-300 rounded-full px-2 py-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 cursor-pointer text-blue-500"
                            onClick={() => setIsComOpen(false)}
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gray-300 rounded-full px-2 py-2"
                        >
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => setIsComOpen(true)}
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </motion.div>
                      )}

                      <p className="text-md font-semibold text-center ml-2">
                        {comments.length}
                      </p>
                    </div>
                    <div className="mb-4 flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-300 rounded-full px-2 py-2"
                      >
                        <IoIosShareAlt className="text-[25px] cursor-pointer" />
                      </motion.div>

                      <p className="text-md font-semibold text-center ml-2">
                        {faker.random.numeric()}
                      </p>
                    </div>
                  </div>
                )}
                <div className="bg-gray-300 px-2 py-2.5 rounded-xl mt-4">
                  <p>{video.length > 8 ? video.slice(0, 60) : video}</p>
                </div>
              </div>
              {isComOpem && (
                <div className="items-center pt-4" id={id}>
                  <Comments
                    comment={comment}
                    setComment={setComment}
                    sendComment={sendComment}
                    comments={comments}
                    loading={loading}
                    ownShow={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDetail;

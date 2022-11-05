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
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast, { Toaster } from "react-hot-toast";

import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";

import { auth, firestore } from "../firebase/firebase";
import Comments from "./Comments";

const Post = ({
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
}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef(null);
  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isComOpem, setIsComOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagCheck, setIsTagCheck] = useState();

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
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
        position: "bottom-right",
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

  const handleChangePage = () => {
    if (user) {
      router.push({
        pathname: `user/${userId}`,
        query: {
          userId: userId,
        },
      });
    } else {
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    if (topic) {
      const tagCheck = topic.match(/#/g);
      setIsTagCheck(tagCheck);
    }
  }, [topic]);

  const handleChangeDetailsPage = () => {
    if (user) {
      router.push({
        pathname: `detail/${id}`,
        query: {
          videoId: id,
        },
      });
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col border-b-2 border-gray-200 pb-6"
      >
        <div>
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded ">
            <div
              className="md:w-16 md:h-16 w-10 h-10"
              onClick={handleChangePage}
            >
              <img
                className=" rounded-full w-14"
                src={profileImage}
                alt="user-profile"
                layout="responsive"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                  {username}
                  <GoVerified className="text-blue-400 text-md" />
                </p>
                <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                  {company}
                </p>
                <div className="flex ml-56">
                  <button
                    type="button"
                    className="inline-block px-4 py-1.5 border border-pink-500 text-pink-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                  >
                    Follow
                  </button>
                </div>
              </div>

              {caption.length > 70 ? (
                <p className="mt-2 font-normal">
                  {caption.slice(0, 100)}
                  {"..."}
                </p>
              ) : (
                <p className="mt-2 font-normal">{caption}</p>
              )}
              <>
                {tagCheck ? (
                  <p className="font-semibold">{topic}</p>
                ) : (
                  <p className="font-semibold">
                    {"#"}
                    {topic}
                  </p>
                )}
              </>

              <div className="flex flex-1 gap-4 py-2.5">
                {songName && (
                  <>
                    {playing ? (
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:ml-20 flex gap-4 relative">
          <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="rounded-3xl"
          >
            <div onClick={handleChangeDetailsPage}>
              <video
                loop
                controls={false}
                ref={videoRef}
                src={video}
                className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[528px] w-[200px] rounded-2xl cursor-pointer bg-gray-100"
              ></video>
            </div>

            {isHover && (
              <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px] p-3">
                {playing ? (
                  <button onClick={onVideoPress}>
                    <BsFillPauseFill className="text-black text-2xl lg:text-4xl" />
                  </button>
                ) : (
                  <button onClick={onVideoPress}>
                    <BsFillPlayFill className="text-black text-2xl lg:text-4xl" />
                  </button>
                )}
                {isVideoMuted ? (
                  <button onClick={() => setIsVideoMuted(false)}>
                    <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
                  </button>
                ) : (
                  <button onClick={() => setIsVideoMuted(true)}>
                    <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
                  </button>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="video-icons items-center mt-8">
              <div className="mb-4">
                {hasLikes ? (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      onClick={likePost}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 cursor-pointer text-red-500"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      onClick={likePost}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 cursor-pointer"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </motion.div>
                )}

                <p className="text-md font-semibold text-center">
                  {likes.length}
                </p>
              </div>
              <div className="mb-4">
                {isComOpem ? (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 cursor-pointer text-blue-500"
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
                  >
                    <a href={`#${id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 cursor-pointer"
                        onClick={() => setIsComOpen(true)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </motion.div>
                )}

                <p className="text-md font-semibold text-center">
                  {comments.length}
                </p>
              </div>
              <div className="mb-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoIosShareAlt className="text-[33px] cursor-pointer" />
                </motion.div>

                <p className="text-md font-semibold text-center">
                  {faker.random.numeric()}
                </p>
              </div>
            </div>
          )}
        </div>
        {isComOpem && (
          <div className="items-center pr-36 pt-4" id={id}>
            <Comments
              comment={comment}
              setComment={setComment}
              sendComment={sendComment}
              comments={comments}
              loading={loading}
              ownShow={false}
            />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Post;

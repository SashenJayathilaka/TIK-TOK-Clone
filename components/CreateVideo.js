import React, { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import { topics } from "../utils/constants";
import useSelectFile from "../hooks/useSelectFile";
import { auth, firestore, storage } from "../firebase/firebase";
import UploadeSkeleton from "./Skeleton/UploadeSkeleton";

const CreateVideo = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [topic, setTopic] = useState(topics[0].name);
  const [loading, setLoading] = useState(false);
  const [wrongFileType, setWrongFileType] = useState(false);
  const [songName, setSongName] = useState("");
  const [hashTags, setHashTags] = useState("");
  const [tagShow, setTagShow] = useState(false);
  const [tagError, setTagError] = useState("");

  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const selectedFileRef = useRef(null);

  const checker = caption.match(/#/g);
  const tagCheck = hashTags.match(/#/g);

  const handleChecker = () => {
    if (checker) {
      setCaption(caption.replace("#", ""));
    } else {
      if (topic === "Other") {
        setTagShow(true);
        /* setHashTags(""); */

        if (tagCheck) {
          setTagError("");
        } else {
          setTagError("You Must Add a # Tag To your Custom Topic");
        }
      } else {
        setTagShow(false);
        setHashTags("#");
      }
    }
  };

  const handlePost = async (e) => {
    /* const fileTypes = ["video/mp4", "video/webm", "video/ogg"]; */

    if (caption && topic && selectedFile && tagCheck) {
      setLoading(true);

      try {
        const docRef = await addDoc(collection(firestore, "posts"), {
          userId: user?.uid,
          username: user?.displayName,
          topic: topic === "Other" ? hashTags : topic,
          songName: songName
            ? songName
            : `original sound - ${user?.displayName}`,
          caption: caption,
          profileImage: user?.photoURL,
          company: user?.email,
          timestamp: serverTimestamp(),
        });

        if (selectedFile) {
          const imageRef = ref(storage, `posts/${docRef.id}/image`);

          await uploadString(imageRef, selectedFile, "data_url").then(
            async (snapshot) => {
              const downloadUrl = await getDownloadURL(imageRef);
              await updateDoc(doc(firestore, "posts", docRef.id), {
                image: downloadUrl,
              });
            }
          );
        } else {
          console.log("No Image");
        }

        setCaption("");
        setTopic("");
        setSelectedFile("");
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!caption) {
        toast.error("Caption field is empty", {
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
      } else if (!tagCheck) {
        toast.error("Your HashTag type is wrong", {
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
      } else {
        toast.error("Topic field is empty", {
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
    }
    setLoading(false);
  };

  const handleDiscard = () => {
    setCaption("");
    setTopic("");
    setHashTags("");
    setSongName("");
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else return;
  }, [user]);

  useEffect(() => {
    handleChecker();
  }, [caption, topic, hashTags]);

  return (
    <div className="flex w-full h-full  absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-2 lg:pt-8 justify-center">
      <Toaster />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6"
      >
        <div>
          <div>
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">
              Post a video to your account
            </p>
          </div>
          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center  outline-none mt-10 w-[260px] h-[400px] pl-10 pr-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            {loading ? (
              <>
                <UploadeSkeleton />
                <p className="text-xl font-semibold text-pink-500 text-xenter mt-4 animate-pulse">
                  uploading...
                </p>
              </>
            ) : (
              <div>
                {!selectedFile ? (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-xl">
                          {/* <FaCloudUploadAlt className='text-gray-300 text-6xl' /> */}
                        </p>
                        <p className="text-xl font-semibold">
                          Select video to upload
                        </p>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mt-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>

                      <p className="text-gray-400 text-center mt-4 text-sm leading-10">
                        MP4 or WebM or ogg <br />
                        720x1280 resolution or higher <br />
                        Up to 10 minutes <br />
                        Less than 2 GB
                      </p>
                      <p className="text-white bg-gradient-to-br from-pink-500 mt-8 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 w-52">
                        Select file
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-video"
                      ref={selectedFileRef}
                      className="w-0 h-0"
                      onChange={onSelectedFile}
                    />
                  </label>
                ) : (
                  <div className=" rounded-3xl w-[300px]  p-4 flex flex-col gap-6 justify-center items-center">
                    <video
                      className="rounded-xl h-[383px] w-[245px] mt-16 bg-black"
                      controls
                      loop
                      src={selectedFile}
                    />
                    <div className=" flex justify-between gap-20">
                      <p className="text-lg">video</p>
                      <button
                        type="button"
                        className=" rounded-full bg-gray-200 text-red-400 p-2 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                        onClick={() => setSelectedFile("")}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {wrongFileType && (
            <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[260px]">
              Please select an video file (mp4 or webm or ogg)
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 mt-24">
          <label className="text-md font-medium ">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2"
          />
          <label className="text-md font-medium ">Song Name</label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            className="rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2"
          />
          <label className="text-md font-medium ">Choose a topic</label>
          <select
            onChange={(e) => {
              setTopic(e.target.value);
            }}
            className="outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
          >
            {topics.map((item) => (
              <option
                key={item.name}
                className=" outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>
          {tagShow && (
            <>
              <input
                type="text"
                value={hashTags}
                placeholder="Add Custom Topic"
                onChange={(e) => setHashTags(e.target.value)}
                className="rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2 "
              />
              {tagError && <p className="text-red-500 text-xs">{tagError}</p>}
            </>
          )}

          {loading ? (
            <div className="mt-10">
              <button
                type="button"
                className="text-white text-center animate-pulse cursor-not-allowed bg-gradient-to-r w-48 lg:w-80 from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-xl px-5 py-2.5 flex justify-center mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 animate-spin"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className={tagError ? `flex gap-6 mt-2` : `flex gap-6 mt-10`}>
              <button
                onClick={handleDiscard}
                type="button"
                className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
              >
                Discard
              </button>
              <button
                disabled={selectedFile ? false : true}
                onClick={handlePost}
                type="button"
                className="text-white font-bold bg-gradient-to-r w-28 lg:w-44 from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 text-lg rounded-lg  px-5  text-center mr-2 cursor-pointer"
              >
                Post
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateVideo;

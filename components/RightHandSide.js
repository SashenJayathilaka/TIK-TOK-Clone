import React, { useEffect, useState } from "react";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

import { firestore } from "../firebase/firebase";
import Post from "./Post";

import Skeleton from "./Skeleton/Skeleton";

const RightHandSide = () => {
  const [posts, setPosts] = useState([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(collection(firestore, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [firestore]
  );

  useEffect(() => {
    setTimeout(() => {
      if (posts) {
        setIsShow(true);
      } else return;
    }, 3000);
  }, [posts]);

  return (
    <div className="right mt-4">
      {isShow ? (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              caption={post.data().caption}
              company={post.data().company}
              video={post.data().image}
              profileImage={post.data().profileImage}
              topic={post.data().topic}
              timestamp={post.data().timestamp}
              username={post.data().username}
              userId={post.data().userId}
              songName={post.data().songName}
              id={post.id}
            />
          ))}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default RightHandSide;

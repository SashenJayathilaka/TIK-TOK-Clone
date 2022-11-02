import React, { useEffect, useState } from "react";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

import { firestore } from "../firebase/firebase";
import Post from "./Post";

const RightHandSide = () => {
  const [posts, setPosts] = useState([]);

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

  return (
    <div className="right mt-4">
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
    </div>
  );
};

export default RightHandSide;

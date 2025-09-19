import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const q = query(collection(db, "photos"), orderBy("likes", "desc"));
      const snapshot = await getDocs(q);
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPhotos();
  }, []);

  const handleLike = async (id) => {
    const photoRef = doc(db, "photos", id);
    await updateDoc(photoRef, { likes: increment(1) });
  };

  const handleVote = async (id, voteType) => {
    const photoRef = doc(db, "photos", id);
    await updateDoc(photoRef, { [`votes.${voteType}`]: increment(1) });
  };

  return (
    <div>
      {photos.map(photo => (
        <div key={photo.id}>
          <img src={photo.url} alt="photo" width={300} />
          <p>Likes: {photo.likes}</p>
          <p>Votes First: {photo.votes.first}, Second: {photo.votes.second}</p>
          <button onClick={() => handleLike(photo.id)}>❤️ Like</button>
          <button onClick={() => handleVote(photo.id, "first")}>1️⃣ Première place</button>
          <button onClick={() => handleVote(photo.id, "second")}>2️⃣ Deuxième place</button>
        </div>
      ))}
    </div>
  );
}

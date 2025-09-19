import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase";

export default function UploadPhoto() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const storageRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, "photos"), {
      url,
      likes: 0,
      votes: { first: 0, second: 0 },
      createdAt: serverTimestamp()
    });
    alert("Photo uploadée !");
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Uploader</button>
    </div>
  );
}

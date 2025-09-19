import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import Login from "./pages/Login";
import UploadPhoto from "./components/UploadPhoto";
import PhotoGallery from "./components/PhotoGallery";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setRole(docSnap.exists() ? docSnap.data().role : "guest");
      } else {
        setUser(null);
        setRole(null);
      }
    });
  }, []);

  if (!user) return <Login />;

  return (
    <div className="App">
      <h1>Photo Contest</h1>
      {role === "admin" && <UploadPhoto />}
      <PhotoGallery />
    </div>
  );
}

export default App;

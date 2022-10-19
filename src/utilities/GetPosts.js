import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
 



export const GetPosts = async (setPosts) => {
    const data = await getDocs(collection(db, "posts"), orderBy("upvotes", "asc"));
    setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    console.log('DB : got posts');

};

export default GetPosts;


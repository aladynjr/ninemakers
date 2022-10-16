import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";


export const GetTags = async (setTags) => {
    const data = await getDocs(collection(db, "tags"));
    setTags(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    console.log('DB : got tags');

};

export default GetTags;


import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import PostCard from '../components/PostCard';
import GetTags from '../utilities/GetTags';
import { Helmet } from "react-helmet";


function SinglePostPage() {

    const { id } = useParams();
    const [post, setPost] = useState(null);

    const GetSinglePost = async (postId) => {
        console.log('post id that we need  : ' + postId )
        //get a post with the field postId equal to postID prop again as a promise from firebase 
        const q = query(collection(db, "posts"), where("postId", "==", postId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setPost(doc.data());
        }
        );
    }
    useEffect(() => {
        GetSinglePost(id.substring(0, 10))
    }, [])

    //get tags
    const [tags, setTags] = useState([]);
    useEffect(() => {
        GetTags(setTags);
    }, [])

    //merge post with tag if tag in post  postTag and tag name in tag tagName are the same 
    const [postWithTag, setPostWithTag] = useState(null);
    useEffect(() => {
        if (!post || !tags) return;

        //merge post with relevant tag 
        const postTag = post.postTag;
        const tagDetails = tags.find(tag => tag.tagName == postTag);
        const postWithTag = {
            ...post,
            tagDetails

        }
        setPostWithTag(postWithTag);
    }, [post, tags])




    //UPVOTED POSTS 
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    useEffect(() => {
        setUpvotedPosts(JSON.parse(localStorage.getItem('upvotedPosts')) || []);
        if (!upvotedPosts) {
            localStorage.setItem('upvotedPosts', JSON.stringify([]));
        }
    }, [])
    //UPVOTING 
    function UpvotePost(postId) {

        //if post is already upvoted remove it from upvoted posts state then update local storage, if its not add it to state and local storage 
        if (upvotedPosts.includes(postId)) {

            setUpvotedPosts(upvotedPosts.filter(post => post !== postId));

            localStorage.setItem('upvotedPosts', JSON.stringify(upvotedPosts.filter(post => post !== postId)));

            UpdateUpvotesInFirebase(postId, -1);


            //decrement upvotes counts locally ot post state
            setPost({ ...post, upvotes: post.upvotes - 1 });


        }
        else {
            setUpvotedPosts([...upvotedPosts, postId]);
            localStorage.setItem('upvotedPosts', JSON.stringify([...upvotedPosts, postId]));

            UpdateUpvotesInFirebase(postId, 1);

            //increment upvotes counts locally
            setPost({ ...post, upvotes: post.upvotes + 1 });


        }
    }

    const UpdateUpvotesInFirebase = async (postId, value) => {
        //get all posts again as a promise
        const data = getDocs(collection(db, "posts"), where("postId", "==", postId))
            .then((data) => {
                data.docs.map((document) => {
                    //decrement upvotes counts locally

                    if (postId == document.data().postId) {
                        updateDoc(doc(db, "posts", document.id), {
                            upvotes: document.data().upvotes + value
                        })
                    }
                    console.log('DB : post updated ')
                })

            });
    }

    return (

        <div style={{ paddingTop: '50px', paddingBottom: '100px' }}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{id.substring(10, id.length)}</title>
                <meta name="description" content={postWithTag?.postContent} />

                <link rel="canonical" href={"/" + id} />
            </Helmet>


            <h1 className='text-2xl w-[90%] max-w-2xl text-left mb-8 ml-6  ' style={{ margin: 'auto' }} >
                <h1 name='post title' >
                    {postWithTag?.postTitle}
                    <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                        style={{ backgroundColor: postWithTag?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px' }} >
                        {postWithTag?.tagDetails?.tagName}
                    </span>
                </h1></h1>

            {postWithTag && <div>
                <div name='Card Container' className=" flex justify-center m-auto my-6 w-11/12 ">
                    <PostCard post={postWithTag} upvotedPosts={upvotedPosts} UpvotePost={UpvotePost} showTitle={false} />
                </div>

            </div>}

        </div>

    )
}

export default SinglePostPage
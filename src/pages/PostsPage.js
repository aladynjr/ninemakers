import React, { useEffect, useState, useReducer } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import GetTags from '../utilities/GetTags';
import GetPosts from '../utilities/GetPosts';
import { ImArrowUp } from 'react-icons/im';
import PostCard from '../components/PostCard';
import { Helmet } from "react-helmet";

function PostsPage() {
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    //get tags 
    const [tags, setTags] = useState([]);


    //get posts from firebase 
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        GetTags(setTags);
        GetPosts(setPosts);
    }, [])


    const [postsWithTags, setPostsWithTags] = useState([]);
    //merge posts with tags if tag in post  postTag and tag name in tag tagName are the same 
    useEffect(() => {
        if (!posts || !tags) return;
        const postsWithTags = posts.map(post => {
            const postTag = post.postTag;
            const tagDetails = tags.find(tag => tag.tagName == postTag);
            return {
                ...post,
                tagDetails
            }
        })
        //sort postsWithTags by upvotes from top to low 
        postsWithTags.sort((a, b) => b.upvotes - a.upvotes);
        
        setPostsWithTags(postsWithTags);

    }, [posts, tags])

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
        console.log({ postId });
        //if post is already upvoted remove it from upvoted posts state then update local storage, if its not add it to state and local storage 
        if (upvotedPosts.includes(postId)) {

            setUpvotedPosts(upvotedPosts.filter(post => post !== postId));

            localStorage.setItem('upvotedPosts', JSON.stringify(upvotedPosts.filter(post => post !== postId)));

            UpdateUpvotesInFirebase(postId, -1);


            //decrement upvotes counts locally
            const updatedPosts = postsWithTags.map(post => {
                if (post.postId === postId) {
                    post.upvotes = post.upvotes - 1;
                }
                return post;
            }
            )
            setPostsWithTags(updatedPosts);

        }
        else {
            setUpvotedPosts([...upvotedPosts, postId]);
            localStorage.setItem('upvotedPosts', JSON.stringify([...upvotedPosts, postId]));

            UpdateUpvotesInFirebase(postId, 1);

            //increment upvotes counts locally
            const updatedPosts = postsWithTags.map(post => {
                if (post.postId === postId) {
                    post.upvotes = post.upvotes + 1;
                }
                return post;
            }
            )
            setPostsWithTags(updatedPosts);

        }
    }

    const UpdateUpvotesInFirebase = async (postId, value) => {
        //get all posts again as a promise
        const data = getDocs(collection(db, "posts"), where("postId", "==", postId))
            .then((data) => {
                data.docs.map((document) => {
            //decrement upvotes counts locally
                    console.log();

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
                <title>99Makers - Topics </title>
                <link rel="canonical" href={"/posts"} />
            </Helmet>
            <h1 className='text-2xl w-[90%] max-w-2xl text-left mb-8 ml-6  ' style={{ margin: 'auto' }} >  Topics</h1>

            {postsWithTags && <div>
                {postsWithTags.map((post,i) => {
                    return (
                        <div key={i} name='Card Container' className=" flex justify-center m-auto my-6 w-11/12 ">

                            <PostCard post={post} upvotedPosts={upvotedPosts} UpvotePost={UpvotePost} />
                        </div>
                    )
                })}
            </div>}

        </div>
    )
}

export default PostsPage
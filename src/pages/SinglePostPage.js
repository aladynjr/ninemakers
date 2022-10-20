import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import PostCard from '../components/PostCard';
import GetTags from '../utilities/GetTags';
import { Helmet } from "react-helmet";
import CommentCard from '../components/CommentCard';

function SinglePostPage() {
    function Random10CharsCode() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }


    const { id } = useParams();
    const [post, setPost] = useState(null);

    const GetSinglePost = async (postId) => {
        console.log('post id that we need  : ' + postId)
        //get a post with the field postId equal to postID prop again as a promise from firebase 
        const q = query(collection(db, "posts"), where("postId", "==", postId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
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


    //Get Comments 
    const [comments, setComments] = useState([]);

    const GetComments = async (postId) => {
        setComments([])
        console.log('post id that we will get its comments  : ' + postId)
        //get a post with the field postId equal to postID prop again as a promise from firebase 
        const q = query(collection(db, "comments"), where("postId", "==", postId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            setComments(comments => [...comments, doc.data()]);
        }
        );
    }
    useEffect(() => {
        if (!tags) return;
        GetComments(id.substring(0, 10))
    }, [])

    //merge comment with relevant tag 
    const [commentsWithTags, setCommentsWithTags] = useState([]);
    useEffect(() => {
        if (!comments || !tags) return;
        const commentsWithTags = comments.map(comment => {
            const commentTag = comment.commentTag;
            const tagDetails = tags.find(tag => tag.tagName == commentTag);
            const commentWithTag = {
                ...comment,
                tagDetails

            }
            return commentWithTag;
        })
        //sort commentsWithTags by upvotes
        commentsWithTags.sort((a, b) => b.upvotes - a.upvotes);


        setCommentsWithTags(commentsWithTags);
    }, [comments, tags])



    console.log({ comments })
    //commenting 
    const [commentTitle, setCommentTitle] = useState('');
    const [commentContent, setCommentContent] = useState('');


    //add post to firebase 
    const postsCollectionRef = collection(db, "comments");
    const CreateComment = async () => {
        setLoading(true);
        await addDoc(postsCollectionRef, {
            commentTitle: commentTitle,
            commentContent: commentContent,
            commentTag: postWithTag?.tagDetails?.tagName,
            postId: postWithTag?.postId,
            commentDate: serverTimestamp(),
            upvotes: 0,
            commentId: Random10CharsCode()
        });
        console.log('DB : post added');
        setLoading(false);
        setAlertMessage('Comment added successfully');
        setAlertSeverity('success');
        setOpenAlert(true);

    };


    //UPVOTED COMMENTS 
    const [upvotedComments, setUpvotedComments] = useState([]);
    useEffect(() => {
        setUpvotedComments(JSON.parse(localStorage.getItem('upvotedComments')) || []);
        if (!upvotedComments) {
            localStorage.setItem('upvotedComments', JSON.stringify([]));
        }
    }, [])
    //UPVOTING  COMMENTS
    function UpvoteComment(commentId) {

        //if comment is already upvoted remove it from upvoted posts state then update local storage, if its not add it to state and local storage 
        if (upvotedComments.includes(commentId)) {

            setUpvotedComments(upvotedComments.filter(comment => comment !== commentId));

            localStorage.setItem('upvotedComments', JSON.stringify(upvotedComments.filter(comment => comment !== commentId)));

            UpdateCommentsUpvotesInFirebase(commentId, -1);


            //decrement upvotes counts locally ot comment state
            setComments(comments.map(comment => {
                if (comment.commentId == commentId) {
                    return {
                        ...comment,
                        upvotes: comment.upvotes - 1
                    }
                }
                return comment;
            }
            ));


        }
        else {
            setUpvotedComments([...upvotedComments, commentId]);
            localStorage.setItem('upvotedComments', JSON.stringify([...upvotedComments, commentId]));

            UpdateCommentsUpvotesInFirebase(commentId, 1);

            //increment upvotes counts locally
            setComments(comments.map(comment => {
                if (comment.commentId == commentId) {
                    return {
                        ...comment,
                        upvotes: comment.upvotes + 1
                    }
                }
                return comment;
            }
            ));



        }
    }

    const UpdateCommentsUpvotesInFirebase = async (commentId, value) => {
        //get all posts again as a promise
        const data = getDocs(collection(db, "comments"), where("commentId", "==", commentId))
            .then((data) => {
                data.docs.map((document) => {
                    //decrement upvotes counts locally

                    if (commentId == document.data().commentId) {
                        updateDoc(doc(db, "comments", document.id), {
                            upvotes: document.data().upvotes + value
                        })
                    }
                    console.log('DB : comment updated ')
                })

            });
    }



    //loading 
    const [loading, setLoading] = useState(false);

    //alert 
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');

    const [alertMessage, setAlertMessage] = useState('')

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    useEffect(() => {
        if (!openAlert) return
        //set open alert to false after 5 seconds 
        setTimeout(() => {
            document.getElementById('alertMessage').classList.add('fade-out')
        }, 1000)
        setTimeout(() => {
            setOpenAlert(false)
            document.getElementById('alertMessage').classList.remove('fade-out')

        }, 2500)

    }, [openAlert])

    return (

        <div style={{ paddingTop: '50px', paddingBottom: '100px' }}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{id.substring(10, id.length)}</title>
                <meta name="description" content={postWithTag?.postContent} />

                <link rel="canonical" href={"/" + id} />
            </Helmet>

            {(loading) && <div id='alertMessage' style={{ height: '100%' }} className=' fade-in w-full h-screen fixed backdrop-blur-xl bg-black/50 z-50 -mt-12  ' >
                <div className="lds-dual-ring" style={{ position: 'sticky', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: '0.7' }} ></div>
            </div>}

            <h1 className='text-2xl  w-[90%] max-w-2xl text-left mb-8 ml-6  ' style={{ margin: 'auto' }} >
                <h1 name='post title' >
                  <div className='font-semibold' >  {postWithTag?.postTitle}</div>
                    <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                        style={{ backgroundColor: postWithTag?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px' }} >
                        {postWithTag?.tagDetails?.tagName}
                    </span>
                </h1>
                {/* <p className='text-block' style={{ lineHeight: '20px', marginTop: '15px' }} >{postWithTag?.postContent}</p> */}

            </h1>




            {/* {postWithTag && <div>
                <div name='Card Container' className=" flex justify-center m-auto my-6 w-11/12 ">
                    <PostCard post={postWithTag} upvotedPosts={upvotedPosts} UpvotePost={UpvotePost} showTitle={false} />
                </div>

            </div>} */}
    <div style={{marginTop:'50px', marginBottom:'10px'}} >
            {commentsWithTags && commentsWithTags.map((comment) => {
                return (

                    <CommentCard comment={comment} upvotedComments={upvotedComments} UpvoteComment={UpvoteComment} />

                )
            })}
</div>
            <div className="flex justify-center flex-col  " style={{ maxWidth: '600px', margin: 'auto', width: '90%' }}  >

                <div className="mb-3 w-11/12" style={{ margin: '20px auto' }}>
                    <label htmlFor="exampleFormControlInput1" className="form-label text-sm  inline-block mb-2 text-gray-700 w-full text-left"
                    >Comment Title</label>
                    <input
                        value={commentTitle}
                        onChange={(e) => setCommentTitle(e.target.value)}
                        type="text"
                        className=" form-control block w-full px-3 py-2  text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300   rounded  transition  ease-in-out   m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   "
                        id="exampleFormControlInput1"
                        placeholder="Your Title"
                    />
                </div>

                <div className="mb-3 w-11/12" style={{ margin: '30px auto', marginTop: '0' }}  >
                    <label htmlFor="exampleFormControlTextarea1" className="form-label text-sm  inline-block mb-2 text-gray-700 w-full text-left "
                    >Comment Content</label>
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="  form-control  block   w-full   px-3   py-3 text-sm   font-normal   text-gray-700   bg-white bg-clip-padding    border border-solid border-gray-300   rounded   transition   ease-in-out   m-0   focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   "
                        id="exampleFormControlTextarea1"
                        rows="3"
                        placeholder="Your Comment Content"
                    ></textarea>
                </div>

                <div className='flex justify-end' style={{ maxWidth: '600px', margin: 'auto', width: '90%' }} >


                    <button
                        onClick={() => {
                            if (commentTitle && commentContent) {
                                CreateComment()
                            } else {
                                setAlertMessage('Please fill all the fields');
                                setAlertSeverity('error');
                                setOpenAlert(true);
                            }


                        }}
                        type="button"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"

                        className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out "
                    >Create Comment</button>
                </div>

            </div>


            {openAlert && <div id='alertMessage'>
                {alertSeverity == 'success' && <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }} className="fade-in  bg-green-100 rounded-lg py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" className="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                    </svg>
                    {alertMessage}
                </div>}

                {alertSeverity == 'error' && <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }} className="fade-in  bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-circle" className="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-110.28 0-200-89.72-200-200S145.72 56 256 56s200 89.72 200 200-89.72 200-200 200zm24-304h-48c-6.627 0-12 5.373-12 12v144c0 6.627 5.373 12 12 12h48c6.627 0 12-5.373 12-12V192c0-6.627-5.373-12-12-12zm0 192h-48v-48h48v48z"></path>
                    </svg>
                    {alertMessage}

                </div>}
            </div>}

        </div>

    )
}

export default SinglePostPage
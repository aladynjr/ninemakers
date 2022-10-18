import React from 'react'
import { ImArrowUp } from 'react-icons/im';
import { Link } from 'react-router-dom';

function PostCard({ post, upvotedPosts, UpvotePost }) {
    return (
        <div name='card' className=" block p-6 rounded-lg Xshadow-lg bg-white max-w-2xl">
            {/* <b> {post.postId + post.postTitle.split(" ").splice(0, 10).join(" ")}</b> */}

            <div className='flex items-center lg:items-start'  >
                <div className='mt-4 mr-4 flex flex-col '>
                    <div style={{ width: 'fit-content' }}
                        className='hover:bg-stone-100 p-1 rounded-lg cursor-pointer'
                        onClick={() => { UpvotePost(post.postId); }}>
                        <ImArrowUp style={{ fontSize: '20px', color: upvotedPosts.includes(post.postId) ? 'rgb(239 68 68)' : 'lightgrey' }} /></div>
                    <span className=' text-sm  my-1 font-semibold' > {post.upvotes}</span>
                </div>
                <img src={post?.tagDetails?.tagUrl} className='mt-2 mr-6 rounded-md' style={{ width: '50px', height: '50px' }} alt="" />

                <div name='title & content' >
                <Link to={`/post/${post.postId+ post.postTitle.split(" ").splice(0, 10).join(" ")}`}>

                    <h1 name='post title' className="text-gray-900 text-base leading-tight font-semibold text-left ">
                        {post.postTitle}
                        <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                            style={{ backgroundColor: post?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px' }} >
                            {post?.tagDetails?.tagName}
                        </span>
                    </h1>
                    </Link>

                    <p name='post content' className="text-gray-700 text-left text-base mt-4 HideOnMobile " style={{ whiteSpace: 'pre-line' }}>
                        {post.postContent}
                    </p>
                </div>
            </div>
            <p name='post content' className="text-gray-700 text-left text-base m-auto mt-4 HideOnDesktop" style={{ whiteSpace: 'pre-line' }}>
                {post.postContent}
            </p>
        </div>
    )
}

export default PostCard
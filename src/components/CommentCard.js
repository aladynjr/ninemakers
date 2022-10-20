import React from 'react'
import { ImArrowUp } from 'react-icons/im'
import { Link } from 'react-router-dom';

function CommentCard({ comment, UpvoteComment, upvotedComments }) {
    return (
        <div>



            <div className='WebflowCardDesign' style={{marginBlock:'15px'}} >

                <Link className="div-block white-box w-inline-block snipcss-9bMbz "
                    style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}
               >
                    <div style={{marginTop:'17px'}} class="postVotes snipcss-i2sDb hover:bg-neutral-100 "  >
                        <div className=' px-4   cursor-pointer  '

                            onClick={() => { UpvoteComment(comment.commentId); }}>

                            <div class="upvote " style={{ borderBottomColor: upvotedComments.includes(comment.commentId) ? 'rgb(239 68 68)' : 'lightgrey' }}>
                            </div>
                            <span >
                                {comment.upvotes}
                            </span>
                        </div>
                    </div>
                    {/* <div>
                        <img src={comment?.tagDetails?.tagUrl} loading="lazy" width="50" alt="" />
                    </div> */}
                    <div class="div-block-2">
                        <h5 class="heading-2">
                            {comment.commentTitle}
                            <span name='post tag' className='w-[90%] max-w-sm text-white text-xs rounded-3xl py-0.5 px-3 ml-2 font-normal '
                                style={{ backgroundColor: comment?.tagDetails?.tagColor, width: 'fit-content', minWidth: '80px', height: 'fit-content', marginTop: '-0.7px', fontSize: '11px' }} >
                                {comment?.tagDetails?.tagName}
                            </span>
                        </h5>
                        <div class="text-block HideOnMobile " style={{ maxWidth: '500px', marginTop:'5px' }} >
                            {comment.commentContent}
                        </div>
                    </div>


                </Link>
                <div class="text-block HideOnDesktop" style={{ width: '90%', textAlign: 'left', margin: 'auto',marginTop:'-15px' }}>
                    {comment.commentContent}
                </div>
            </div>

        </div>
    )
}

export default CommentCard
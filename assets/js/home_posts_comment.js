let allCommentForm = $(' .comment-section');   // contains all the comment form of post
{
    let commentDltBtn = $(' .comment-dlt-btn');   // contains all the dlt btn of comment

    // method to create comment using AJAX
    let createNewComment = function(){
        allCommentForm = $(' .comment-section');   // contains all the comment form of post
        allCommentForm.submit(function(e){
            e.preventDefault();
            let form = $(this);
            $.ajax({
                method: 'POST',
                url: '/comments/create',
                data: form.serialize(),
                success: function(data){
                    let comment = newComment(data.data.comment);
                    $(` .post-comment-${data.data.comment.post}`).prepend(comment);
                    $(' .comment-input').val("");
                    commentDltBtn = $(' .comment-dlt-btn');
                    // adding event on dlt btn of comment
                    commentDltBtn.click(function(e){
                        e.preventDefault();
                        let dltTag = $(this);
                        deleteComment(dltTag);
                    });
                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: '1500'
                    }).show();
                },error: function(error){
                    new Noty({
                        theme: 'relax',
                        text: error.responseText,
                        type: 'error',
                        layout: 'topRight',
                        timeout: '1500'
                    }).show();
                    console.log(error.responseText);
                }
            });
        });
    }

    // newComment which will added to the DOM
    let newComment = function(comment){
        return `<div id="comment-container-${ comment._id }">
                    <p>
                        <a class="comment-dlt-btn" href="/comments/destroy/${ comment._id }">X</a>
                        ${ comment.content }   
                    </p>
                    <p><a id="toggle-like" href="/likes/toggle?id=${comment.id}&type=Comment"><span id="comment-like-count">0</span> likes</a><p>
                    <p>${ comment.user.name }</p>
                </div>`
    }

    // adding event on dlt btn of comment
    commentDltBtn.click(function(e){
        e.preventDefault();
        let dltTag = $(this);
        deleteComment(dltTag);
    });

    // method to delete a comment using AJAX
    let deleteComment = function(dltTag){
        $.ajax({
            method: 'GET',
            url: $(dltTag).attr('href'),
            success: function(data){
                $(`#comment-container-${data.data.commentId}`).remove();
                commentDltBtn = $(' .comment-dlt-btn');
                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    layout: 'topRight',
                    timeout: '1500'
                }).show();
            },error: function(err){
                new Noty({
                    theme: 'relax',
                    text: error.responseText,
                    type: 'error',
                    layout: 'topRight',
                    timeout: '1500'
                }).show();
                console.log(err.responseText);
            }
        });
    }


    
    createNewComment();

    // making ajax request when 

}
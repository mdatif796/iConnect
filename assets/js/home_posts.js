{

    let aTag = $(' .post-dlt-btn');     // it stores the post dlt btn 

    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let formPost = $('#post-section');

        formPost.submit(function(e){
            e.preventDefault();

            $.ajax({
                url: 'posts/create-post',
                method: 'POST',
                data: formPost.serialize(),
                success: function(data){
                    $('#posts-list-container').prepend(newPost(data.data));
                    // add the new post delete button to aTag
                    aTag = $(' .post-dlt-btn');

                    aTag.click(function(e){
                        e.preventDefault();
                        let a = $(this);
                        deletePost(a);
                    });

                    $('#content').val("");

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

    // method to show the new post using AJAX
    let newPost = function(data){
        return $(`<div id="post-${ data.post._id }">
                    <h1>
                        <a class="post-dlt-btn" href="/posts/destroy/${ data.post._id } ">X</a>
                        ${ data.post.content }  
                    </h1>
                    <p>${ data.post.user.name } </p>
                    <div class="post-comment">
                        <form action="/comments/create" method="post">
                            <input type="text" name="content" required placeholder="Type Here your comments...">
                            <input type="hidden" name="post" value="${ data.post._id }">
                            <input type="submit" value="Add Comment">
                        </form>
                    </div>
                    <div class="post-comment-${ data.post._id } ">

                    </div>
                </div>`)
    }


    aTag.click(function(e){
        e.preventDefault();
        let a = $(this);
        deletePost(a);
    });

    // method to delete a post using AJAX
    let deletePost = function(dltTag){
        $.ajax({
            method: 'GET',
            url: $(dltTag).attr('href'),
            success: function(data){
                $(`#post-${data.data.postId}`).remove();

                aTag = $(' .post-dlt-btn');

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
    }
        // console.log($(aTag[0]).attr('href'));




    createPost();
}
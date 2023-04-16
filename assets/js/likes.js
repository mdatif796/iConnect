let allLikeTag = $(' #toggle-like');
{
    let toggleLike = async (toggleTag) => {
        console.log($(toggleTag));
        console.log($(toggleTag).attr('href'));
        $.ajax({
            method: 'POST',
            url: $(toggleTag).attr('href'),
            success: (data) => {
                // console.log('data: ', data);
                $(toggleTag , "span").text(data.likeLength + ' likes');
                console.log(data.likeLength);
                new Noty({
                    theme: 'relax',
                    text: data.deletable ? 'Like remove successfully' : 'Like added successfully',
                    type: 'success',
                    layout: 'topRight',
                    timeout: '1500'
                }).show();
            },
            error: (err) => {

            }
        });
    }


    let main = async () => {
        allLikeTag = $(' #toggle-like');
        $(allLikeTag).on('click', event => {
            event.preventDefault();
            const clickedElements = $(event.target);
            const targetElement = clickedElements.closest('#toggle-like');
            toggleLike(targetElement);
        });

    }


    main();
}
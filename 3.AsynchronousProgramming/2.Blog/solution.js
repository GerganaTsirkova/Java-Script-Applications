function attachEvents() {
    const kinveyAppId = "kid_ByCOePf97/";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = "peter";
    const kinveyPassword = "p";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = { "Authorization": "Basic " + base64auth };
    const posts = $('#posts');

    let loadPostsBtn = $('#btnLoadPosts');
    let view = $('#btnViewPost');
    
    loadPostsBtn.click(function () {
        $.ajax({
            method: 'GET',
            url: serviceUrl + 'posts',
            headers: authHeaders
        }).then(function (res) {
            for (let re of res) {
                posts.append($(`<option value="${re._id}" body="${re.postBody}">${re.postTitle}</option>`));
            }
        }).catch(function (err) {
            console.log(err);
        })
    });
    
    view.click(function () {
        let selectedElement = $('#posts option:selected');
        $("#post-title").text(selectedElement.text());
        let postText = selectedElement.attr('body');
        let postBody = $("#post-body");
        postBody.empty();
        postBody.append($(`<li>${postText}</li>`));
        let id = selectedElement.attr('value');
        let postComments = $('#post-comments');
        $.ajax({
            method: 'GET',
            url: serviceUrl + `comments/?query={"post_ID":"${id}"}`,
            headers: authHeaders
        }).then(function (res) {
            postComments.empty();
            for (let comment of res) {
                let li = $(`<li>${comment.text}</li>`);
                postComments.append(li)
            }
        }).catch(function (err) {
            console.log(err);
        })
    })
}
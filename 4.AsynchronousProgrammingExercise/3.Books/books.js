function solve() {
    const url = 'https://baas.kinvey.com/appdata/kid_H12lqKcCm/Book';
    const kinveyUsername = "guest";
    const kinveyPassword = "guest";
    const auth = `Basic ${btoa(kinveyUsername + ":" + kinveyPassword)}`;
    const headers = {"Authorization": auth, "Content-type": "application/json"};
    const BODY = $('body');

    BODY.append($(`<button>GET ALL BOOKS</button>`));
    BODY.append($('<ul>'));
    BODY.append($('<input id="isbn">'));
    BODY.append($('<input id="title">'));
    BODY.append($('<input id="author">'));
    BODY.append($('<button>CREATE BOOK</button>'));
    BODY.append($('<button style="display: none">UPLOAD EDITED BOOK</button>'));
    $('button:contains("GET ALL BOOKS")').on('click', getBooks);
    $('button:contains("CREATE BOOK")').on('click', createBook);

    function getBooks(){
        $('ul').empty();
        $.ajax({
            method: 'GET',
            url: url,
            headers: headers
        }).then(function (response) {
            for (let res of response) {
                $('ul')
                    .append($(`<li>${res.isbn}. ${res.title} - ${res.author} </li>`)
                        .append($('<button>DELETE</button>').on('click',function () {
                            let that = $(this);
                            $.ajax({
                                method: 'DELETE',
                                url: url +'/'+ res._id,
                                headers: headers
                            }).then(function () {
                                console.log($(that).parent());
                                $(that).parent().remove();
                            });
                        }))
                        .append($('<button>EDIT</button>').on('click',function () {
                            let editBookBtn = $('button:contains("UPLOAD EDITED BOOK")');
                            let str = $(this).parent().text();
                            $('button:contains("CREATE BOOK")').css('display','none');
                            editBookBtn.css('display','block');
                            let tokensMain = str.split(' - ');
                            let first = tokensMain[0];
                            let subTokens1 = first.split('. ');
                            let isbn = subTokens1[0];
                            let title = subTokens1[1];
                            let second = tokensMain[1];
                            second = second.substring(0,second.length-11);
                            let author = second;
                            $('#isbn').val(isbn);
                            $('#title').val(title);
                            $('#author').val(author);
                            editBookBtn.on('click',function () {
                                $.ajax({
                                    method: 'PUT',
                                    url: url +'/'+ res._id,
                                    data: JSON.stringify({
                                        isbn:$('#isbn').val(),title:$('#title').val(),author:$('#author').val()
                                    }),
                                    headers: headers
                                }).then(function () {
                                    getBooks();
                                    $('#isbn').val('');
                                    $('#title').val('');
                                    $('#author').val('');
                                    $('button:contains("CREATE BOOK")').css('display','block');
                                    $('button:contains("UPLOAD EDITED BOOK")').css('display','none');
                                });
                            })

                        })));
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    function createBook() {
        let [ isbn,title,author] = [ $('#isbn').val(), $('#title').val(), $('#author').val()];

        if(isbn,title,author){
            let p1 = $.ajax({
                method: 'POST',
                url: url,
                data: JSON.stringify({
                    isbn,title,author
                }),
                headers: headers
            });

            let p2 =  function(){
                $('ul').append($('<li>${isbn}. ${title} - ${author} </li>'));
                $('#isbn').val('');
                $('#title').val('');
                $('#author').val('');
            };
            let p3 = getBooks();
            Promise.all([p1,p2,p3]);
        }
    }

}

const URL = 'https://phonebook-d1638.firebaseio.com/phonebook';
const person = $('#person');
const number = $('#phone');

$('#btnLoad').on('click', loadData);
$('#btnCreate').on('click',createContact);
function loadData() {
    $('#phonebook').empty();
    $.ajax({
        method: 'GET',
        url: URL + '.json',
        success: handleSuccess,
        error: handleError
    });

    function handleSuccess(res) {
        for (let element in res) {
            $('#phonebook').append(
                $(`<li>${res[element].name}: ${res[element].phone} </li>`)
                    .append($('<a href="#">[Delete]</a>').click(function () {
                        $.ajax({
                            method: 'DELETE',
                            url: URL + '/' + element + '.json',
                            success: loadData,
                            error: handleError
                        })
                    }))
            )
        }
    }
}

function createContact() {
    let name = person.val();
    let phone = number.val();
    $.ajax({
        method: 'POST',
        url: URL + '.json',
        data: JSON.stringify({name,phone}),
        success: appendElement,
        error: handleError
    });

    function appendElement(res) {
        loadData();
    }
    person.val('');
    number.val('');
}

function handleError(err) {
    console.log(err);
}
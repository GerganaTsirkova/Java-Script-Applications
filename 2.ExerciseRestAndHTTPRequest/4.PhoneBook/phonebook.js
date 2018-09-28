function attachEvents() {
    let URL = 'https://phonebook-d1638.firebaseio.com';
    let allPhones = $('#phonebook');
    let loadBtn = $('#btnLoad').on('click',loadData);
    let createBtn = $('#btnCreate').on('click',function () {
        let phone = $('#phone');
        let name = $('#person');
        if ((name.val() !== '') && (phone.val() !== '')) {
            $.ajax({
                method: 'POST',
                url: URL  + '/phonebook/.json',
                data: JSON.stringify({name:name.val(),phone:phone.val()}),
                success: handleSuccess,
                error: (err) => {
                    console.log(err)
                }
            });

            function handleSuccess() {
                loadData();
                phone.val('');
                name.val('');
            }
        }
    });


    function loadData() {
        allPhones.empty();
        $.ajax({
            method: 'GET',
            url: URL +'/' + '.json',
            success: handleSuccess,
            error: (err)=>{console.log(err)}
        });
        function handleSuccess(res) {
            let phoneBook = Object.values(res);
            let phoneDetailsValues = Object.values(phoneBook[0]);
            let phoneDetailsKeys = Object.keys(phoneBook[0]);
            let detailsWeNeed = Object.values(phoneDetailsValues);
            for (let i = 0; i < detailsWeNeed.length; i++) {
                let currentID = phoneDetailsKeys[i];
                let li = $(`<li>${detailsWeNeed[i].name}: ${detailsWeNeed[i].phone} </li>`)
                    .append($('<button>[Delete]</button>').click(function () {
                        $.ajax({
                            type: 'delete',
                            url: URL +'/phonebook/'+ currentID + '.json',
                            success: successFunc,
                            error: (err)=>{console.log(err)}
                        });

                        function  successFunc() {
                            loadData()
                        }
                    }));

                allPhones.append(li);
            }
        }
    }
}

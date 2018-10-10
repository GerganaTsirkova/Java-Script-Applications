function attachEvents() {

    const serviceUrl = 'https://baas.kinvey.com/appdata/kid_B1Gcvu75X/biggestCatches';
    const kinveyUsername = "gitsa";
    const kinveyPassword = "12345";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = {"Authorization": "Basic " + base64auth, "Content-type": "application/json"};
    const catches = $('#catches');
    let angler = $('#addForm .angler');
    let weight = $('#addForm .weight');
    let species = $('#addForm .species');
    let location = $('#addForm .location');
    let bait = $('#addForm .bait');
    let captureTime = $('#addForm .captureTime');

    $('.load').click(function () {
        $.ajax({
            method: 'GET',
            url: serviceUrl,
            headers: authHeaders
        }).then(function (res) {
            catches.empty();
            for (let fishCatch of res) {
                let div = $(`<div class="catch" data-id="${fishCatch._id}"></div>`)
                    .append($('<label>Angler</label>'))
                    .append($(`<input type="text" class="angler" value="${fishCatch.angler}"/>`))
                    .append($('<label>Weight</label>'))
                    .append($(`<input type="number" class="weight" value="${fishCatch.weight}"/>`))
                    .append($('<label>Species</label>'))
                    .append($(`<input type="text" class="species" value="${fishCatch.species}"/>`))
                    .append($('<label>Location</label>'))
                    .append($(`<input type="text" class="location" value="${fishCatch.location}"/>`))
                    .append($('<label>Bait</label>'))
                    .append($(`<input type="text" class="bait" value="${fishCatch.bait}"/>`))
                    .append($('<label>Capture Time</label>'))
                    .append($(`<input type="number" class="captureTime" value="${fishCatch.captureTime}"/>`))
                    .append(($('<button class="update">Update</button>')).on('click', function () {
                        $.ajax({
                            method: 'PUT',
                            url: serviceUrl + `/${fishCatch._id}`,
                            headers: authHeaders
                        }).then(function () {
                            $.ajax({
                                method: 'POST',
                                url: serviceUrl,
                                headers: authHeaders,
                                data: JSON.stringify({
                                    angler: angler.val(),
                                    weight: weight.val(),
                                    species: species.val(),
                                    location: location.val(),
                                    bait: bait.val(),
                                    captureTime: captureTime.val()
                                })
                            }).then(function () {
                                $('.load').trigger("click");
                                angler.val('');
                                weight.val('');
                                species.val('');
                                location.val('');
                                bait.val('');
                                captureTime.val('');
                            }).catch(function (err) {
                                console.log(err);
                            })
                            $('.load').trigger("click");
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }))
                    .append(($('<button class="delete">Delete</button>')).on('click', function () {
                        $.ajax({
                            method: 'DELETE',
                            url: serviceUrl + `/${fishCatch._id}`,
                            headers: authHeaders
                        }).then(function () {
                            $(`div .catch [data-id="${fishCatch._id}]`).remove();
                            $('.load').trigger("click");
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }));

                catches.append(div);
            }
        }).catch(function (err) {
            console.log(err);
        })
    });

    $('.add').click(function () {
        post();
    });

    function post() {
        $.ajax({
            method: 'POST',
            url: serviceUrl,
            headers: authHeaders,
            data: JSON.stringify({
                angler: angler.val(),
                weight: weight.val(),
                species: species.val(),
                location: location.val(),
                bait: bait.val(),
                captureTime: captureTime.val()
            })
        }).then(function () {
            $('.load').trigger("click");
            angler.val('');
            weight.val('');
            species.val('');
            location.val('');
            bait.val('');
            captureTime.val('');
        }).catch(function (err) {
            console.log(err);
        })
    }
}
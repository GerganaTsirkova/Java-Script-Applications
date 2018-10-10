function attachEvents() {

    const serviceUrl = 'https://baas.kinvey.com/appdata/kid_B1Gcvu75X/biggestCatches';
    const kinveyUsername = "gitsa";
    const kinveyPassword = "12345";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = {"Authorization": "Basic " + base64auth, "Content-type": "application/json"};
    const catches = $('#catches');

    $('.load').click(function () {
        loadData();
    });

    $('.add').click(function () {
        let angler = $('#addForm input.angler');
        let weight = $('#addForm input.weight');
        let species = $('#addForm input.species');
        let location = $('#addForm input.location');
        let bait = $('#addForm input.bait');
        let captureTime = $('#addForm input.captureTime');
        if ((angler.val() !== '') && (species.val() !== '') && (location.val() !== '') && (bait.val() !== '') && (angler.val() !== undefined) &&
            (typeof Number(weight.val()) === "number") && (species.val() !== undefined) && (location.val() !== undefined) && (bait.val() !== undefined) && (typeof Number(captureTime.val()) === "number")) {
            $.ajax({
                method: 'POST',
                url: serviceUrl,
                headers: authHeaders,
                data: JSON.stringify({
                    angler: angler.val(),
                    weight: Number(weight.val()),
                    species: species.val(),
                    location: location.val(),
                    bait: bait.val(),
                    captureTime: Number(captureTime.val())
                })
            }).then(function () {
                loadData();
                angler.val('');
                weight.val('');
                species.val('');
                location.val('');
                bait.val('');
                captureTime.val('');
            }).catch((err)=>{console.log(err)})
        }
    });

    function deleteBaseRequest(id) {
        $.ajax({
            method: 'DELETE',
            url: serviceUrl + `/${id}`,
            headers: authHeaders
        }).then(function () {
            $(`div .catch [data-id="${id}]`).remove();
            $('.load').trigger("click");
        }).catch((err)=>{console.log(err)})
    }

    function update(id) {
        let angler = $(`#catches .catch [data-id="${id}"] .angler`).val();
        let weight = $(`#catches .catch [data-id="${id}"].weight`).val();
        let species =$(`#catches .catch [data-id="${id}"].species`).val();
        let location = $(`#catches .catch [data-id="${id}"].location`).val();
        let bait = $(`#catches .catch [data-id="${id}"].bait`).val();
        let captureTime = $(`#catches .catch [data-id="${id}"].captureTime`).val();
        console.log(angler);
        console.log(weight);
        console.log(species);

        $.ajax({
            method: 'PUT',
            url: serviceUrl + '/' + id,
            headers: authHeaders,
            data: JSON.stringify({
                angler: angler,
                weight: Number(weight),
                species: species,
                location: location,
                bait: bait,
                captureTime: Number(captureTime)
            })
        }).then(function () {
            loadData();
        }).catch((err)=>{console.log(err)});
    }


    function loadData() {
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
                    .append($(`<input type="number" class="weight" value="${Number(fishCatch.weight)}"/>`))
                    .append($('<label>Species</label>'))
                    .append($(`<input type="text" class="species" value="${fishCatch.species}"/>`))
                    .append($('<label>Location</label>'))
                    .append($(`<input type="text" class="location" value="${fishCatch.location}"/>`))
                    .append($('<label>Bait</label>'))
                    .append($(`<input type="text" class="bait" value="${fishCatch.bait}"/>`))
                    .append($('<label>Capture Time</label>'))
                    .append($(`<input type="number" class="captureTime" value="${Number(fishCatch.captureTime)}"/>`))
                    .append(($('<button class="update">Update</button>')).on('click', update(fishCatch._id)))
                    .append(($('<button class="delete">Delete</button>')).on('click', deleteBaseRequest(fishCatch._id)));

                catches.append(div);
            }
        }).catch((err)=>{console.log(err)})
    }
}
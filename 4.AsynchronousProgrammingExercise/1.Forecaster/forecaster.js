function attachEvents() {
    let btn = $('#submit');
    let location = $('#location');
    let code = '';
    let hasTown = false;
    let current = $('#current');
    let upcoming = $('#upcoming');

    btn.on('click', function () {
        if (location.val() !== '') {
            $.ajax({
                method: 'GET',
                url: 'https://judgetests.firebaseio.com/locations.json'
            }).then(function (response) {
                current.empty();
                current.append($('<div class="label">Current conditions</div>'));
                for (let res of response) {
                    if (res.name === location.val()) {
                        code = res.code;
                        hasTown = true;
                        let p1 = $.ajax({
                            url: `https://judgetests.firebaseio.com/forecast/today/${code}.json`
                        }).then(function (resCurrent) {
                            let symbol = '';
                            let degrees = '&#x2614';
                            if (resCurrent.forecast.condition === 'Rain') {
                                symbol = '&#x2614';
                            } else if (resCurrent.forecast.condition === 'Sunny') {
                                symbol = '&#x2600';
                            } else if (resCurrent.forecast.condition === 'Partly sunny') {
                                symbol = '&#x26C5';
                            } else if (resCurrent.forecast.condition === 'Overcast') {
                                symbol = '&#x26C5';
                            }
                            $('#current')
                                .append($(`<span class="condition symbol">${symbol}</span>`))
                                .append($(`<span class="condition"></span>`)
                                    .append($(`<span class="forecast-data">${resCurrent.name}</span>`))
                                    .append($(`<span class="forecast-data">${resCurrent.forecast.low}&#176/${resCurrent.forecast.high}&#176</span>`))
                                    .append($(`<span class="forecast-data">${resCurrent.forecast.condition}</span>`)));
                        });

                        let p2 = $.ajax({
                            url: `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`
                        }).then(function (resUpComing) {
                            upcoming.empty();
                            upcoming.append($('<div class="label">Three-day forecast</div>'));
                            for (let resUpComingElement of resUpComing.forecast) {
                                let symbol = '';
                                let degrees = '&#x2614';
                                if (resUpComingElement.condition === 'Rain') {
                                    symbol = '&#x2614';
                                } else if (resUpComingElement.condition === 'Sunny') {
                                    symbol = '&#x2600';
                                } else if (resUpComingElement.condition === 'Partly sunny') {
                                    symbol = '&#x26C5';
                                } else if (resUpComingElement.condition === 'Overcast') {
                                    symbol = '&#x26C5';
                                }
                                $('#upcoming')
                                    .append($('<span class="upcoming">')
                                        .append($(`<span class="symbol">${symbol}</span>`))
                                        .append($(`<span class="forecast-data">${resUpComingElement.low}&#176/${resUpComingElement.high}&#176</span>`))
                                        .append($(`<span class="forecast-data">${resUpComingElement.condition}</span>`)))
                            }
                        });

                        Promise.all([p1, p2])
                            .then(function () {
                                $('#forecast').css('display', 'block');
                            })
                            .catch(function (err) {
                                $('#forecast').css('display', 'block');
                                $('.label').text('Error');
                            });
                        location.val('');
                        break;
                    }
                }
                if (hasTown === false) {
                    $('#forecast').css('display', 'block');
                    $('.label').text('Error');
                    location.val('');
                }
            }).catch(function (err) {
                $('.label').text('Error');
                location.val('');
            });

        }
    })
}
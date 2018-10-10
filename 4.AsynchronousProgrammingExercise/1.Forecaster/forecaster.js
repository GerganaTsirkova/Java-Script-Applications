function attachEvents() {
    let location = $('#location');
    let btn = $('#submit');
    const URL = 'https://judgetests.firebaseio.com/locations.json';
    const DIVFORECAST = $('#forecast');
    let currentCondition = $('div#current div.label');
    let upcomingCondition = $('div#upcoming div.label');
    let current = $('#current');
    let upcoming = $('#upcoming');

    btn.click(function () {
        DIVFORECAST.css('display', 'none');
        currentCondition.text('Current conditions');
        upcomingCondition.text('Three-day forecast');
        $('div .err').remove();
        $('span').remove();

        $.ajax({
            method: 'GET',
            url: URL
        }).then(function (response) {
            let code = '';
            let found = false;
            for (let res of response) {
                if (res.name === location.val()) {
                    found = true;
                    code = res.code;
                    $.ajax({
                        method: 'GET',
                        url: `https://judgetests.firebaseio.com/forecast/today/${code}.json`
                    }).then(function (todayRes) {
                        let currentCondition = todayRes.forecast.condition;
                        let symbol = '';
                        if (currentCondition === 'Rain') {
                            symbol = '&#x2614';
                        }
                        else if (currentCondition === 'Sunny') {
                            symbol = '&#x2600';
                        }
                        else if (currentCondition === 'Partly sunny') {
                            symbol = '&#x26C5';
                        }
                        else if (currentCondition === 'Overcast') {
                            symbol = '&#x2601';
                        }
                        else if (currentCondition === 'Degrees') {
                            symbol = '&#176';
                        }
                        let spanSymbol = $(`<span class="condition symbol">${symbol}</span>`);
                        let span = $(`<span class="condition"></span>`);
                        current
                            .append(spanSymbol)
                            .append(span
                                .append($(`<span class="forecast-data">${todayRes.name}</span>`))
                                .append($(`<span class="forecast-data">${todayRes.forecast.low}°/${todayRes.forecast.high}°</span>`))
                                .append($(`<span class="forecast-data">${todayRes.forecast.condition}</span>`))
                            );
                        DIVFORECAST.css('display', 'block');
                    }).catch(function (todayErr) {
                        handleError();
                    });

                    $.ajax({
                        method: 'GET',
                        url: `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`
                    }).then(function (upcomingRes) {

                        for (let day of upcomingRes.forecast) {
                            let condition = day.condition;
                            let symbol = '';
                            if (condition === 'Rain') {
                                symbol = '&#x2614';
                            }
                            else if (condition === 'Sunny') {
                                symbol = '&#x2600';
                            }
                            else if (condition === 'Partly sunny') {
                                symbol = '&#x26C5';
                            }
                            else if (condition === 'Overcast') {
                                symbol = '&#x2601';
                            }
                            else if (condition === 'Degrees') {
                                symbol = '&#176';
                            }
                            $('#upcoming')
                                .append($('<span class="upcoming"></span>')
                                    .append($(`<span class="symbol">${symbol}</span>`))
                                    .append($(`<span class="forecast-data">${day.low}°/${day.high}°</span>`))
                                    .append($(`<span class="forecast-data">${day.condition}</span>`)));
                            location.val('');
                        }
                    }).catch(function (upcomingErr) {
                        handleError();
                    });
                }
            }
            if ((found === false) || (location.val() === '')) {
                handleError();
            }

        }).catch(function (err) {
            handleError();
        });
    });

    function handleError() {
        current.append($('<div class="err">Error</div>'));
        upcoming.append($('<div class="err">Error</div>'));
        DIVFORECAST.css('display', 'block');
        location.val('');
    }
}
let flyFrom = null;
let flyTo = null;
let fromDate = null;
let toDate = null;
let city = null;



const options = {

    headers: new Headers({
        "user-key": "4d1fd27573b6d91183797cc18f880b5e"
    })
};

let valid = function (e) {
    if (e.length != 3) {
        return false
    }
    e = e.replace(/[a-z]/gi, '');
    if (e.length === 0) {
        return true;
    }
    return false;
}

function nextPage() {
    $('.locEnter').on('click', function (e) {
        flyFrom = $('input[class="frontsearch"]').val();
        flyFrom = flyFrom.toUpperCase();

        if (valid(flyFrom)) {
            $('.homePage').hide();
            $('.parameterPage').show();
            $('.parameterPage').find('.departure').append(` ${flyFrom}`)
        } else {
            alert(`that is not valid airport code format.`)
        }
    });
}

function getParams() {
    $('.params').submit(function (e) {
        event.preventDefault();
        flyTo = $('.dest').val();
        flyTo = flyTo.toUpperCase();
        fromDate = $('.from').val();
        fromDate = fromDate.split('-').reverse().join('/');
        toDate = $('.to').val();
        toDate = toDate.split('-').reverse().join('/');
        city = $('.city').val();
        if (valid(flyTo)) {
            $('.parameterPage').hide();
            flightFetcher();
            restaurantFetch(city);
            weatherFetch();
        } else {
            alert('please enter a valid airport code.')
        }


    })

}



function genericFetch(url, callback) {

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw Error(response.statusText);

        })
        .then(responseJSON => {
            callback(responseJSON);
        })
        .catch(error => {
            if (alert(`${flyTo} is not a valid entry. Make sure you are entering the airport code`)) { }
            else { $('.parameterPage').show() }
        })


}

function genericFetchOptions(url, callback) {
    const options = {

        headers: new Headers({
            "user-key": "4d1fd27573b6d91183797cc18f880b5e"
        })
    };

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw Error(response.statusText);
        })
        .then(responseJSON => {
            callback(responseJSON);
        })
        .catch(error => {
            alert(`${city} is not a valid city, please check your spelling`)
            $('.parameterPage').show()
        })


}

function generateFlightURL() {
    let url = `https://api.skypicker.com/flights?fly_from=city:${flyFrom}&fly_to=city:${flyTo}&partner=picky&curr=USD&currency=USD&date_from=${fromDate}&date_to=${toDate}&conversion=USD&partner_market=US&limit=3`
    return url
}

function displayFlightResults(responseJson) {
    for (let i = 0; i < responseJson.data.length; i++) {
        $('.test').hide();
        $('.resultsPage').show();
        $('.resultsPage').find('.fRes').append(`<li><a target="blank" href=${responseJson.data[i].deep_link}> ${responseJson.data[i].flyFrom}=>${responseJson.data[i].flyTo}</a> Price:$ ${responseJson.data[i].price}</li>`)
        $('.newSearch').show()
    }
}


function flightFetcher() {
    let url = generateFlightURL();

    genericFetch(url, displayFlightResults)
}


function restaurantCityCallback(responseJson) {

    let id = responseJson.location_suggestions[0].city_id

    let url = (`https://developers.zomato.com/api/v2.1/search?entity_id=${id}&entity_type=city&q=food&count=3,options`)

    genericFetchOptions(url, displayRestaurantResults)
}

function displayRestaurantResults(responseJson) {
    for (let i = 0; i < 5; i++) {

        $('.resultsPage').find('.rRes').append(`<li><a target= "blank" href=${responseJson.restaurants[i].restaurant.url}> ${responseJson.restaurants[i].restaurant.name} - ${responseJson.restaurants[i].restaurant.user_rating['aggregate_rating']}*</a></li>`)
    }
}

function restaurantFetch(city) {
    let url = (`https://developers.zomato.com/api/v2.1/locations?query=${city}`)

    genericFetchOptions(url, restaurantCityCallback)
}



function weatherFetch() {

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=9de243494c0b295cca9337e1e96b00e2`

    genericFetch(url, weatherForecast)

}

function weatherForecast(responseJson) {
    $('.resultsPage').find('.wReport').append(` in ${city}`)
    $('.resultsPage').find('.weatherResults').append(`<ul><li>High - ${responseJson.main.temp_max}</li><li> Low - ${responseJson.main.temp_min}</li>
    <li>Humidity - ${responseJson.main.humidity}%</li><li>Description - ${responseJson.weather[0].description}</li>`)

}

function clearResults(){
        $('.resultsPage').find('.fRes').empty()
        $('.resultsPage').find('.rRes').empty()
        $('.resultsPage').find('.wReport').empty()
        $('.resultsPage').find('.weatherResults').empty()
}

function newSearch() {
    $('.newSearch').on('click', function (e) {
        $('.newSearch').hide()
        clearResults()
        $('.homePage').show()
    })
}





function domReady() {
    $(nextPage);
    $(getParams);
    $(newSearch);
}

$(domReady);
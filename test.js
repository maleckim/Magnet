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

function nextPage(){
    $('.locEnter').on('click', function(e){
        flyFrom = $('input[class="search"]').val();
        flyFrom = flyFrom.toUpperCase();
        $('.homePage').hide();
        $('.parameterPage').show();
    });
}

function getParams(){
    $('.params').submit(function(e){
       event.preventDefault();
       flyTo = $('.dest').val();
       flyTo = flyTo.toUpperCase();
       fromDate = $('.from').val();
       toDate = $('.to').val();
       city = $('.city').val();
       $('.parameterPage').hide();
       flightFetcher();
       restaurantFetch(city);
       weatherFetch();
       
          
    })

}


function genericFetch(url, callback){

    fetch(url)
      .then( response => {
        if ( response.ok ){
          return response.json();
        }
  
        throw Error( response.statusText );
      })
      .then( responseJSON => {
        callback( responseJSON );
      });
  
  }

function genericFetchOptions(url, callback){
    const options = {

        headers: new Headers({
            "user-key": "4d1fd27573b6d91183797cc18f880b5e"
        })
    };

    fetch(url,options)
      .then( response => {
        if ( response.ok ){
          return response.json();
        }
  
        throw Error( response.statusText );
      })
      .then( responseJSON => {
        callback( responseJSON );
      });
  
  }

function generateFlightURL(){
    let url = `https://api.skypicker.com/flights?fly_from=city:${flyFrom}&fly_to=city:${flyTo}&partner=picky&curr=USD&currency=USD&date_from=${fromDate}&date_to=${toDate}&conversion=USD&partner_market=US&limit=5`
    return url
}

function displayFlightResults(responseJson){
    for(let i = 0; i < responseJson.data.length; i ++){
        $('.test').hide();
        $('.resultsPage').show();
        $('.resultsPage').find('.flightResults').append(`<a target="blank" href=${responseJson.data[i].deep_link}> ${responseJson.data[i].flyFrom}=>${responseJson.data[i].flyTo} </a>`)
    }
}

  
function flightFetcher(){
      let url = generateFlightURL();
      
      genericFetch(url, displayFlightResults)
  }


function restaurantCityCallback(responseJson){
    console.log('id')
    let id = responseJson.location_suggestions[0].city_id
    
    let url = (`https://developers.zomato.com/api/v2.1/search?entity_id=${id}&entity_type=city&q=food&count=5,options`)

    genericFetchOptions(url, displayRestaurantResults)
}

function displayRestaurantResults(responseJson){
    for(let i = 0; i < 5; i ++){
        console.log(responseJson.restaurants[i])
        $('.resultsPage').find('.restaurantResults').append(`<a target= "blank" href=${responseJson.restaurants[i].restaurant.url}> ${responseJson.restaurants[i].restaurant.name} - ${responseJson.restaurants[i].restaurant.user_rating['aggregate_rating']}*</a>`)
    }
}

function restaurantFetch(city){
    let url = (`https://developers.zomato.com/api/v2.1/locations?query=${city}`)
    
    genericFetchOptions(url, restaurantCityCallback )
}

function weatherFetch(){
    let url = `http://api.weatherstack.com/current?access_key=ed299871e432d599fc8c3a5bdfa4f859&query=${flyTo}&units=f`
    

    genericFetch(url, weatherForecast)

}

function weatherForecast(responseJson){
    console.log(responseJson);
    $('.resultsPage').find('.weatherResults').append(`<p>Current Temp - ${responseJson.current.temperature}</p><p> Feels Like - ${responseJson.current.feelslike}</p>
    <p>Humidity - ${responseJson.current.humidity}</p><p>${responseJson.current.weather_descriptions}</p>`)
}


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
    
   let lat = position.coords.latitude;
   let long = position.coords.longitude;
    
   genericFetch(`http://api.weatherstack.com/current?access_key=8bbdbccbbeab9c6104711906071d37fe&query=${lat},${long}&units=f`,showWeatherOnMain)

}

function showWeatherOnMain(responseJson){
    $('.homePage').find('.weather').append(`current temperature is ${responseJson.current.temperature}, let's change that`)   
}

function domReady(){
    $(nextPage);
    $(getParams);
    
    
    
          
}

$(domReady);






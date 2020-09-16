$(document).ready(function() {


    var apiKey = "188366c4a74fbb8bc6a6f7d868a6bfa2"; 


        // create click event for city search 
        $("#submitCity").on("click", function () {
        return getWeather();
    
        });
    
        $(".history").on("li", function () {
            return createRow();
    
        });

        // history btn weather
        // $(".historyBtn").on("click", function () {
        //     return getWeather();
        
        //     });
        
    
        // when history list click, function makeRow is called
        function createRow(searchValue) {
    
            // console.log(searchValue)
            var li = $("<button>").addClass("list-group-item historyBtn list-group-item-action").text(searchValue);
            $(".history").append(li);
    
        };
    
        function getWeather(searchValue) {
    
            // create a var and assign the value received back from API
            var searchValue = $("#city").val();
            
            // make a request to API openweahtermap
            // console.log(searchValue)
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?q=' + searchValue + "&units=imperial" + "&appid=" + apiKey,
                method: "GET",
                
            })
    
    
                // After the data from AJAX comes back, we show the weather
                .then(function (data) {
                //console.log(data)
    
                    //create history link for this search
                    if (history.indexOf(searchValue) === -1) {
                        history.push(searchValue);
                        window.localStorage.setItem("history", JSON.stringify(history));
    
                        createRow(searchValue);
                    } 
    
                    // clear any old content
                    $("#today").empty();
    
                    // create html content for today weather
    
                    var card = $("<div>").addClass("card");
                    var body = $("<div>").addClass("card-body");
                    var title = $("<h3>").addClass("card-title").text(data.name + "(" + new Date().toLocaleDateString() + ")");
                    var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
                    var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
                    var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");
    
                    // merge and add to the page
                    card.append(body);
                    title.append(image);
                    body.append(title, temp, humidity, wind);
                    $("#today").append(card);
    
                    // move to the next fuction 
                    getForecast(searchValue);
                    getUVIndex(data.coord.lat, data.coord.lon);
    
                });
    
        }
    
        function getForecast(searchValue) {
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + "&appid=" + apiKey+"&units=imperial",
                method: "GET",
    
            })
    
                //show weather
                .then(function (data) {
                    // create title and empty row
                
                    $("#forecast").html("<h4>5-Day Forecast:</h4>").append("<div class=\"row\">")
    
                    // loop over all forecasts by 3-hour increments
                    for (var i = 0; i < data.list.length - 1; i++) {
    
                        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                            
                            // create HTML for forecast row
    
                            var col = $("<div>").addClass("col-sm-2");
                            var card = $("<div>").addClass("card bg-primary text-white");
                            var body = $("<div>").addClass("card-body p-2");
                            var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                            var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png");
                            var temp = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + "F");
                            var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
    
    
                            // merge and add to the page
    
                            col.append(card);
                            card.append(body);
                            body.append(title, image, temp, humidity);
                            $("#forecast .row").append(col);
    
                        }
    
                    }
    
    
    
                });
    
        }
    
        function getUVIndex(lat, lon) {

            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/uvi?' + "&appid=" + apiKey + 
                '&lat=' + lat + '&lon=' + lon,
                method: "GET",
            
            })
    
             //show the weather
            .then(function (data) {
            // console.log(data)
                var uvIndex = $("<p>").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(data.value);
    
                if(data.value <= 2) {
                    btn.addClass("btn-success");
                } 
    
                else if (data.value <= 5) {
                btn.addClass("btn-warning");
    
            } 
            
                else {
                btn.addClass("btn-danger");
            }
    
            $("#today .card-body").append(uvIndex.append(btn));
    
        });
    
        }
    
    
    
    // get any history
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
    // console.log(history)
    if (history.length > 0) {
    getWeather(history[0]);
    }
    
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }
    
    });
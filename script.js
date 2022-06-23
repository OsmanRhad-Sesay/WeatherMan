// sets variables used in functions from html file
const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    refreshIcon = wrapper.querySelector("header i");

// creates the api variable
let api;

// get data from user input field when they press enter
inputField.addEventListener ("keyup", e => {
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});


// get geolocation from user
locationBtn.addEventListener ("click", () => {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    //if the browser does not allow geolocation
    else {
        alert ("Your browser not support geolocation api");
    }
});

function requestApi (city) {
    //using the api to get weather based on city
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=96a9138db01a4dd25258e55fc48976ea`;
    fetchData();
}

function onSuccess (position) {
    //using the api to get weather based on coordinates
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=96a9138db01a4dd25258e55fc48976ea`;
    fetchData();
}

function onError () {
    //if the user does not allow the program to get their geolocation an error message is shown
    infoTxt.innerText = "You have to allow the program to have your geolocation for this button to work!";
    infoTxt.classList.add("error");
}

function fetchData() {
    //the brief loading message
    infoTxt.innerText = "Weather is loading...";
    infoTxt.classList.add("pending");
    //if there is an error with loading the weather the program with display an error message
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "beep boop something went wrong!";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
    // error message if the city entered by user is not valid
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        // info obtained from api stored in variables
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        // matches the weather id with the names of icons based on number
        if(id == 800){
            wIcon.src = "SVG/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "SVG/storm.svg";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "SVG/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "SVG/foggy.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "SVG/cloudy.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "SVG/rain.svg";
        }


        //loads the weather info from api into the html code
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

// refresh button for the program
refreshIcon.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
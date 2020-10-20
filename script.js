console.log("Hello World");
$(document).ready(function () {
  console.log("ready");
  
 // JS GLOBAL VARIABLES
  var queryURL = "";
  var apiBase = "https://api.teleport.org/api/cities/?search=";
  var querySecondURL = "";
  var urbanSlugAPI = "";
  var teleportURL = "";
  var countryCode = "";
  var selectedCity = "";
  var qolEmbedBody= ""
  var colEmbedBody= ""
  var jobEmbedBody=""
  var safetyEmbedBody = ""
  var educationEmbedBody =""
  var climateEmbedBody =""
  
  
  //ON PAGE LOAD, HIDES CARDS
  function onLoad(){
    $(".post-search").hide();
  }
  onLoad()

  // GENERATES THE CITIES ON THE DROPDOWN
  function generateCities(){
    var queryURL = "https://developers.teleport.org/assets/urban_areas.json"
    var cityArray = Object.keys(cities);
    console.log(cityArray);
    cityArray.sort(function(a,b){
    if (a < b )return -1
    else if (a === b)return 0
    else return 1
    })
    
    for (var i = 0; i < cityArray.length; i++){
      var option = $(`<option value="${cityArray[i]}" data-reactid="${i+1}">${cityArray[i]}</option>`)
    $("#inputGroupSelect03").append(option);
    }
      }
      generateCities();
    
      // AJAX CALLS FOR ADZUNA
  function categorySelect() {
    $("#job-list").empty();
   // USER INPUT FOR JOBS
    var category = $("#inputGroupSelect04").val();
    localStorage.setItem("categoryName", category);
    queryURL =
      "https://api.adzuna.com/v1/api/jobs/" +
      countryCode +
      "/search/1?app_id=be3ea934&app_key=92b7a058356afbbaa6b1cf90c7bae1c1&where=" + selectedCity + "&results_per_page=20&what=" +
      category; 
   
    // var category = $("#inputGroupSelect04").val();
  
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
        console.log("This is API response: ", response.results);

      // WILL LOOP THROUGH THE JOB OPTIONS
      for (var i = 0; i < response.results.length; i++){
        var card = `<div class="card-job-list">
        <div class="card-header" id="job-search">
        <h5>${response.results[i].title}</h5>
        </div>
        <div class="card-body" id="job-list">
        <h6>${response.results[i].company.display_name}</h6>
        <p>${response.results[i].description}</p>
        <a href = "${response.results[i].redirect_url}">View Details</a>
        </div>
      </div>
      <br>`
      var cardEL = $(card);
     
      $('#job-list').append(cardEL);
      };
    });
  }

  // AJAX CALL FOR CITY AND RETURNS FUTURE API URL
  function geoIdentify() {
    var searchCity = $("#inputGroupSelect03").val();
    console.log(searchCity);
    localStorage.setItem("cityName", searchCity);
    selectedCity = searchCity;
    $.ajax({
      url: apiBase + searchCity,
      method: "GET",
    }).done(function (response) {
      console.log(response);
      querySecondURL =
        response._embedded["city:search-results"][0]._links["city:item"].href;
      urbanSlug();
    });
  }

  // PULLS THE URBAN AREAS API URL FOR SPECIFIED CITY
  function urbanSlug() {
    $.ajax({
      url: querySecondURL,
      method: "GET",
    }).done(function (response) {
      console.log(response);
      console.log(response._links["city:urban_area"].href);

      //COUNTRY CODE GRABBED BY ADZUNA API
      var countryURL = response._links["city:country"].href;
      countryCode = countryURL.substr(-3, 2).toLowerCase();
      console.log(countryCode);
      urbanSlugAPI = response._links["city:urban_area"].href;
      console.log(urbanSlugAPI);
      teleportSite();
      categorySelect();
    });
  }

  // TELEPORT AJAX CALL
  function teleportSite() {
    $.ajax({
      url: urbanSlugAPI,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      // GRABS TELEPORT URL TO EMBED FOR WIDGET 
      teleportURL = response.teleport_city_url;
      qolEmbedBody = '<a class="teleport-widget-link display-block" href="' + teleportURL +  '">Life quality score - ' + $("#inputGroupSelect03").val().toUpperCase() + '</a><script async class="teleport-widget-script" data-url="' +teleportURL + 'widget/scores/?currency=USD&citySwitcher=false" data-max-width="420" data-height="968" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>';
      colEmbedBody = '<a class="teleport-widget-link display-block" href="' +teleportURL + '">Cost of living - ' + $("#inputGroupSelect03").val().toUpperCase() + '</a><script async class="teleport-widget-script" data-url="' + teleportURL+ 'widget/costs/?currency=USD&citySwitcher=false" data-max-width="420" data-height="968" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>'
      jobEmbedBody = '<a class="teleport-widget-link display-block" href="' +teleportURL + '">Job salary calculator - ' + $("#inputGroupSelect03").val().toUpperCase() + '</a><script async class="teleport-widget-script" data-url="'+ teleportURL + 'widget/salaries/?currency=USD&citySwitcher=false" data-max-width="420" data-height="968" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>'
      safetyEmbedBody = '<a class="teleport-widget-link display-block" href="' +teleportURL +  '">Safety - ' + $("#inputGroupSelect03").val().toUpperCase() + '</a><script async class="teleport-widget-script" data-url="'+ teleportURL + 'widget/crime/?currency=USD&citySwitcher=false" data-max-width="420" data-height="1214" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>'
      educationEmbedBody = '<a class="teleport-widget-link display-block" href="' +teleportURL +  '">Education - ' + $("#inputGroupSelect03").val().toUpperCase() + '</a><script async class="teleport-widget-script" data-url="'+ teleportURL + 'widget/education/?currency=USD&citySwitcher=false" data-max-width="420" data-height="1214" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>'
      climateEmbedBody = '<a class="teleport-widget-link display-block" href="' +teleportURL +  '">Climate - ' + $("#inputGroupSelect03").val().toUpperCase() + '</a><script async class="teleport-widget-script" data-url="'+ teleportURL + 'widget/weather/?currency=USD&citySwitcher=false" data-max-width="420" data-height="1214" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>'
      return qualityOfLife();
    });
  }

  // POPULATES WIDGETS TO THE RESPECTIVE DIVS
  function qualityOfLife (){
    $("#qol-widget").empty();
    $("#qol-widget").append(qolEmbedBody);
    $("#col-widget").empty();
    $("#col-widget").append(colEmbedBody);
    $("#job-widget").empty();
    $("#job-widget").append(jobEmbedBody);
    $("#safety-widget").empty();
    $("#safety-widget").append(safetyEmbedBody);
    $("#education-widget").empty();
    $("#education-widget").append(educationEmbedBody);
    $("#climate-widget").empty();
    $("#climate-widget").append(climateEmbedBody);
  }

  // EVENT LISTENER FOR WHEN USER CLICK BUTTON
  $("#submit").on("click", function (event) {
    event.preventDefault();
    $(".post-search").show();
    geoIdentify();
    $(document).ajaxError(function () {
      $("#errorModal").show();
  });
});
  $("#closeBtn").on("click", function (event) {
    $("#errorModal").hide();
});
  });

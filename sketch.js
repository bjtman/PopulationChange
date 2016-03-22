// Brian Tice
// 3/15/2016

var apiKey = "de82210fea483ad04be2ba50124b83ba506cdffb"; // TODO: add api key


var request = {
    "level": "state",
    "state": "",
    "variables": [],
    "api": "sf1",
    "year": ""

};

var states = [
"AL", "AK", "AZ", "AR", "CA",
"CO", "CT", "DE", "FL", "GA",
"HI", "ID", "IL", "IN", "IA",
"KS", "KY", "LA", "ME", "MD",
"MA", "MI", "MN", "MS", "MO",
"MT", "NE", "NV", "NH", "NJ",
"NM", "NY", "NC", "ND", "OH",
"OK", "OR", "PA", "RI", "SC", 
"SD", "TN", "TX", "UT", "VT",
"VA", "WA", "WV", "WI", "WY"
]

var variables = [
    "population",
    "population_families",
    "population_female",
    "population_male",
  ]

var colorMap = {
    "population_1990" : 100,
    "population_families_1990" : 150,
    "population_female_1990" : 200,
    "population_male_1990" : 255,
    "population_2000" : 30,
    "population_families_2000" : 60,
    "population_female_2000" : 90,
    "population_male_2000" : 120,
    "population_2010" : 100,
    "population_families_2010" : 125,
    "population_female_2010" : 150,
    "population_male_2010" : 175
  
};

var playSound = true;

var detectWhichState = 0;

// Use this variable
var selectedState;
var census;

var loaded = 0

var popData = {}

function preload() {
  
  fontRegular = loadFont("assets/Quicksand-Regular.otf")
  
  // load sounds
  mySoundMale = loadSound('assets/moreMalePop.mp3');
  mySoundFemale = loadSound('assets/moreFemalePop.mp3');
  
}


function getAllData(stateName, decade) {
  request.state = stateName
  request.variables = [];
  
  for (var i=0; i<variables.length; i++) {
    request.variables.push(variables[i]+"_"+decade)
  }
  request.year = decade

  // Make a a census request for each state
  census.APIRequest(request, function(response) {
    //console.log(response);
   
    rawData = response.data[0];
    var popDataForState = {};
    var total = 0;
    for (var key in rawData) {
      popDataForState[key] = Number(rawData[key]);
      total += popDataForState[key];
    }
    popDataForState.total = total;
    popData[decade][stateName] = popDataForState;
    
    loaded++
    if (loaded==states.length*3) {
    // console.log(popData)
  }
  });
}



function setup() {
  // Enable the census module
  var sdk = new CitySDK();
  census = sdk.modules.census;
  census.enable(apiKey);
  popData["1990"] ={}
  popData["2000"] ={}
  popData["2010"] ={}
  
  for (var index=0; index<states.length; index++) {
    getAllData(states[index], "1990");
    getAllData(states[index], "2000");
    getAllData(states[index], "2010");
    
  }
  var cnv = createCanvas(windowWidth, windowHeight);
  
  //createCanvas(windowWidth, windowHeight);
  
  // Load Font stuff from assets folder
  
  
}

function draw() {

  background(0);
  strokeWeight(0);
  textAlign(CENTER);
  
  var numStates = states.length
  var numYears = 3
  if (loaded>=numStates*numYears){
    var stateNameWidth = width/numStates
    i=0
    
    var populationFamilyArray = [popData["1990"][states[detectWhichState]].population_families_1990,
                                 popData["2000"][states[detectWhichState]].population_families_2000,
                                 popData["2010"][states[detectWhichState]].population_families_2010];
                           
    var populationArray = [popData["1990"][states[detectWhichState]].population_1990,
                           popData["2000"][states[detectWhichState]].population_2000,
                           popData["2010"][states[detectWhichState]].population_2010];
                           
    var populationMaleArray = [popData["1990"][states[detectWhichState]].population_male_1990,
                               popData["2000"][states[detectWhichState]].population_male_2000,
                               popData["2010"][states[detectWhichState]].population_male_2010];
                               
    var populationFemaleArray = [popData["1990"][states[detectWhichState]].population_female_1990,
                                 popData["2000"][states[detectWhichState]].population_female_2000,
                                 popData["2010"][states[detectWhichState]].population_female_2010];
    
    // find max and min values for each array
    
    var popFamMin = min(populationFamilyArray);
    var popFamMax = max(populationFamilyArray);
    
    var popMin = min(populationArray);
    var popMax = max(populationArray);
    
    var popMaleMin = min(populationMaleArray);
    var popMaleMax = max(populationMaleArray);
    
    var popFemaleMin = min(populationFemaleArray);
    var popFemaleMax = max(populationFemaleArray);
    
    // Play sounds according to greater change
    
    var changeInMale = popMaleMax - popMaleMin;
    var changeInFemale = popFemaleMax - popFemaleMin;
    
    if(playSound) {
      if(changeInMale >= changeInFemale) {
        mySoundMale.play();
        playSound = false;
      }
      else {
        mySoundFemale.play();
        playSound = false;
      }
    }  
    
     // 1990 information
    
    push();
    translate(width/6,height/2 + 100); // first state marker
    fill(253,141,60);
    
    var radiusFamilyPop1990 =       map(populationFamilyArray[0],0,popFamMax,30,80);
    var radiusPop1990 =             map(populationArray[0],0,popMax,30,50);
    var radiusMalePop1990 =         map(populationMaleArray[0],0,popMaleMax,30,50);
    var radiusFemalePop1990 =       map(populationFemaleArray[0],0,popFemaleMax,30,50);
    
    polygon(0, 0, radiusFamilyPop1990, 6); 
    
    fill(252,78,42);
    polygon(115, 75, radiusPop1990, 6); 
    
    fill(227,26,28);
    polygon(0, 115, radiusMalePop1990, 6); 
    
    fill(254,178,76);
    polygon(95, -70, radiusFemalePop1990, 6); 
    
    pop();
    
    text("Family Pop: " + populationFamilyArray[0],width/6-100,450);
    text("Total Pop: "  + populationArray[0],width/6+140,670);
    text("Male Pop: " +   populationMaleArray[0],width/6+30,710);
    text("Female Pop: " + populationFemaleArray[0],width/6+140,350);
    
    console.log(radiusFemalePop1990);
    
    // 2000 information 
    
    push();
    translate(width/2,height/2 + 100); // first state marker
    fill(253,141,60);
    
    var radiusFamilyPop2000 =       map(populationFamilyArray[1],0,popFamMax,30,80);
    var radiusPop2000 =             map(populationArray[1],0,popMax,30,50);
    var radiusMalePop2000 =         map(populationMaleArray[1],0,popMaleMax,30,50);
    var radiusFemalePop2000 =       map(populationFemaleArray[1],0,popFemaleMax,30,50);
    
    polygon(0, 0, radiusFamilyPop2000, 6); 
    
    fill(252,78,42);
    polygon(115, 75, radiusPop2000, 6); 
    
    fill(227,26,28);
    polygon(0, 115, radiusMalePop2000, 6); 
    
    fill(254,178,76);
    polygon(95, -70, radiusFemalePop2000, 6); 
    
    pop();
    
    text("Family Pop: " + populationFamilyArray[1],width/2-100,450);
    text("Total Pop: "  + populationArray[1],width/2+140,670);
    text("Male Pop: " +   populationMaleArray[1],width/2+30,710);
    text("Female Pop: " + populationFemaleArray[1],width/2+140,350);
    
    // 2010 information
    
    push();
    translate(5*width/6,height/2 + 100); // first state marker
    fill(253,141,60);
    
    var radiusFamilyPop2010 =       map(populationFamilyArray[2],0,popFamMax,30,80);
    var radiusPop2010 =             map(populationArray[2],0,popMax,30,50);
    var radiusMalePop2010 =         map(populationMaleArray[2],0,popMaleMax,30,50);
    var radiusFemalePop2010 =       map(populationFemaleArray[2],0,popFemaleMax,30,50);
    
    polygon(0, 0, radiusFamilyPop2010, 6); 
    
    fill(252,78,42);
    polygon(115, 75, radiusPop2010, 6); 
    
    fill(227,26,28);
    polygon(0, 115, radiusMalePop2010, 6); 
    
    fill(254,178,76);
    polygon(95, -70, radiusFemalePop2010, 6); 
    
    pop();
    
    text("Family Pop: " + populationFamilyArray[2],5*width/6-100,450);
    text("Total Pop: "  + populationArray[2],5*width/6+140,670);
    text("Male Pop: " +   populationMaleArray[2],5*width/6+30,710);
    text("Female Pop: " + populationFemaleArray[2],5*width/6+140,350);
    
    
    
    //textFont("Helvetica");
    
    // Show Populations
    
    //text( popData["1990"][states[detectWhichState]].population_families_1990, width/6, 450)
    //text( popData["2000"][states[detectWhichState]].population_families_2000, width/2, 460)
    //text( popData["2010"][states[detectWhichState]].population_families_2010, (5*width)/6, 450)
    
    for (var i=0; i<states.length; i++) {
      
      currState = states[i]
      
      //console.log(currState)
      
      //text (currState, i*stateNameWidth, 80)
      
      
      
      //text( popData["1990"][currState].population_male_1990, i*stateNameWidth, 180)
      //text( popData["2000"][currState].population_male_2000, i*stateNameWidth, 190)
      //text( popData["2010"][currState].population_male_2010, i*stateNameWidth, 200)
      
      textSize(50);
      fill(127);
      text(states[detectWhichState], width/2, height/5+20);
      
      textSize(24);
      text("1990", width/6,height/3+30);
      text("2000", 3*width/6,height/3+30);
      text("2010", 5*width/6, height/3+30);
      
      textSize(10);
      fill(127);
      text (currState, i*(stateNameWidth)+10, 30);
    }

  }
  else {
    fill(255)
    textSize(32);
    var percentLoaded = round(map(loaded,0,150,0,100)) 
    text ("Loading Data " +percentLoaded + "%" ,width/2, height/2)
  }
  
  
    
  
  
}

//

// Resize Canvas based upon inner window width and height
function windowResized() {
  
  resizeCanvas(windowWidth, windowHeight);
  
}

function mouseClicked() {
  
  // Check which vertial zone that the mouse is in upon click.
  // Do this with width/numStates 
  
  var rectangleSize = states.length/windowWidth;
  
  detectWhichState = round(mouseX*rectangleSize);
  
  playSound = true;
  
  console.log(detectWhichState);
  console.log(states.length)
  
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}



 
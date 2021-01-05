
alert("You are advised to click on the button adjacent to the service(s) you wish to call. Services without a button have already been contacted.");
var carnumb=localStorage.getItem('carnumber');
var x = document.getElementById("demo");
var l=0,i=0;
var map;
var platitude=0, plongitude=0,pnumber;
var flatitude=0,flongitude=0,fnumber;
var hlatitude=0,hlongitude=0,hnumber; 
var model, timestamp;
var pscount,hcount,fscount;
var hicon = {
  url: 'images/hospital.svg', // url
  scaledSize: new google.maps.Size(40, 40), // scaled size

};
var ficon = {
  url: 'images/firestation.svg', // url
  scaledSize: new google.maps.Size(40, 40), // scaled size

};
var picon = {
  url: 'images/police.svg', // url
  scaledSize: new google.maps.Size(40, 40), // scaled size

};
var cicon = {
  url: 'images/car.svg', // url
  scaledSize: new google.maps.Size(40, 40), // scaled size

};

function initmap()
{
 
  var mapOptions = {
  zoom: 20,
  center: { lat: l, lng: i }};
  var flag=0;
  var Latitude=0;
  var Longitude=0;

  //Firebase setup
  var firebaseConfig = {
  apiKey: "AIzaSyA69MLGB1K5PAwR9RZL_tXtGZL3vUy3iSo",
  authDomain: "das-honda.firebaseapp.com",
  databaseURL: "https://das-honda-default-rtdb.firebaseio.com",
  projectId: "das-honda",
  storageBucket: "das-honda.appspot.com",
  messagingSenderId: "399060144608",
  appId: "1:399060144608:web:68a47d8a596eea0e6ddb85"
  };
  firebase.initializeApp(firebaseConfig);

  const dataRef = firebase.database().ref().child(carnumb).child('Car');
  const dataps = firebase.database().ref().child(carnumb).child('Police Station');
  const datafs = firebase.database().ref().child(carnumb).child('Fire Station');
  const datahs = firebase.database().ref().child(carnumb).child('Hospitals');
  const datats=firebase.database().ref().child(carnumb);
  const ps= firebase.database().ref().child("Graphs").child('Police Station');
  const h= firebase.database().ref().child("Graphs").child('Hospitals');
  const fs= firebase.database().ref().child("Graphs").child('Fire Stations');

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var   marker = new google.maps.Marker({position: { lat: l, lng: i },icon:cicon,map: map});
  var marker1 = new google.maps.Marker({position: { lat: platitude, lng: plongitude },icon:picon,map: map});
  var marker2 = new google.maps.Marker({position: { lat: hlatitude, lng: hlongitude },icon:hicon,map: map});
  var marker3 = new google.maps.Marker({position: { lat: flatitude, lng: flongitude },icon:ficon,map: map});


  datats.on('value', snap=>{
    dictionary=snap.val();
     timestamp=dictionary['Timestamp'];
     model=dictionary['Model'];
    flags=dictionary['Flags'];

    if (flags['psflag']==1)
    document.getElementById('psbutton').style.display= "none";
    if(flags['hflag']==1)
    document.getElementById('hbutton').style.display= "none";
    if(flags['fsflag']==1)
    document.getElementById('fsbutton').style.display= "none";

    ps.child(model).on('value', snap=>{
      pscount=snap.val();

    }); 
    h.child(model).on('value', snap=>{
      hcount=snap.val();

    }); 
    fs.child(model).on('value', snap=>{
      fscount=snap.val();

    }); 
  });

  

  dataRef.on('value', snap =>{
  marker.setMap(null);

  dictionary= snap.val();
  Latitude=dictionary['Latitude'];
  Longitude=dictionary['Longitude'];


  l=Latitude;
  i=Longitude;
  map.setCenter(new google.maps.LatLng(l, i));
  marker = new google.maps.Marker({position: { lat: l, lng: i },icon:cicon,map: map});


  var infowindow = new google.maps.InfoWindow({
      content:carnumb});
  google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map, marker);});


}); 




//////////////POLICE STATION MARKER
dataps.on('value', snap =>{
  marker1.setMap(null);
  
  dictionary= snap.val();
  pname=dictionary['Name'];
  plocation=dictionary['Location'];
  platitude=dictionary['Latitude'];
  plongitude=dictionary['Longitude'];
  pnumber=dictionary['Phone'];
  document.getElementById('pname').innerHTML=pname;
  document.getElementById('plocation').innerHTML=plocation;
  document.getElementById('pnumber').innerHTML=pnumber;



  marker1 = new google.maps.Marker({position: { lat: platitude, lng: plongitude },icon:picon,map: map});



  var infowindow1 = new google.maps.InfoWindow({
    content:"<li>"+pname+"</li>"+"<li>"+plocation+"</li>"+"<li>"+pnumber+"</li>"});
google.maps.event.addListener(marker1, 'click', function() {
infowindow1.open(map, marker1);});
});

//////////////HOSPITAL MARKER
datahs.on('value', snap =>{
  marker2.setMap(null);
  
  dictionary= snap.val();

  hname=dictionary['Name'];
  hlocation=dictionary['Location'];
  hlatitude=dictionary['Latitude'];
  hlongitude=dictionary['Longitude'];
  hnumber=dictionary['Phone'];
  document.getElementById('hname').innerHTML=hname;
  document.getElementById('hlocation').innerHTML=hlocation;
  document.getElementById('hnumber').innerHTML=hnumber;

 

  marker2 = new google.maps.Marker({position: { lat: hlatitude, lng: hlongitude },icon:hicon,map: map});



  var infowindow2 = new google.maps.InfoWindow({
    content:"<li>"+hname+"</li>"+"<li>"+hlocation+"</li>"+"<li>"+hnumber+"</li>"});
  google.maps.event.addListener(marker2, 'click', function() {
  infowindow2.open(map, marker2);});
});

//////////////FIRE STATION MARKER
datafs.on('value', snap =>{
  marker3.setMap(null);
  
  dictionary= snap.val();

  fname=dictionary['Name'];
  flocation=dictionary['Location'];
  flatitude=dictionary['Latitude'];
  flongitude=dictionary['Longitude'];
  fnumber=dictionary['Phone'];

  document.getElementById('fname').innerHTML=fname;
  document.getElementById('flocation').innerHTML=flocation;
  document.getElementById('fnumber').innerHTML=fnumber;

 

  marker3 = new google.maps.Marker({position: { lat: flatitude, lng: flongitude },icon:ficon,map: map});



  var infowindow3 = new google.maps.InfoWindow({
    content:"<li>"+fname+"</li>"+"<li>"+flocation+"</li>"+"<li>"+fnumber+"</li>"});
  google.maps.event.addListener(marker3, 'click', function() {
  infowindow3.open(map, marker3);});
});

}

initmap();

function policestation()
{
  const ps= firebase.database().ref().child("Graphs").child('Police Station').child(model);
  const datats=firebase.database().ref().child(carnumb);
  datats.child('Flags').child('psflag').set(1);
  ps.set(parseInt(pscount)+1);
  document.getElementById('psbutton').style.display= "none";
  const services=firebase.database().ref().child("Graphs").child('Police Services').child(timestamp+';'+model+';'+carnumb);
  services.set("Police Station");

}

function hospitals()
{
  const h= firebase.database().ref().child("Graphs").child('Hospitals').child(model);
  const datats=firebase.database().ref().child(carnumb);
  datats.child('Flags').child('hflag').set(1);
  h.set(parseInt(hcount)+1);
  document.getElementById('hbutton').style.display= "none";
  const services=firebase.database().ref().child("Graphs").child('Hospital Services').child(timestamp+';'+model+';'+carnumb);
  services.set("Hospitals");

}
function firestation()
{
  const fs= firebase.database().ref().child("Graphs").child('Fire Stations').child(model);
  const datats=firebase.database().ref().child(carnumb);
  datats.child('Flags').child('fsflag').set(1);
  fs.set(parseInt(fscount)+1);
  document.getElementById('fsbutton').style.display= "none";
  const services=firebase.database().ref().child("Graphs").child('Fire Station Services').child(timestamp+';'+model+';'+carnumb);
  services.set("Fire Station");

}

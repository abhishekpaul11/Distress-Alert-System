var dps = [];
var dh=[];
var dfs=[];
var lat=[];
var long=[];
var timestamps=[];
var models=[];
var markers=[];
var infowin=[];
var carno=[];
var psservice=[];
var hservice=[];
var fsservice=[];

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
    const dataRef = firebase.database().ref().child('Graphs').child('Police Station');
    dataRef.on('value', snap =>{
       dps=[];
        dict=snap.val();
       
        for (const [key, value] of Object.entries(dict)) 
        {
            dps.push({label:key, y: value });
        }

    var chart = new CanvasJS.Chart("chartContainer", {
        axisX:{
        	
            interval: 1
        },
        title :{
            text: "Police Station"
        },
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
        chart.render();
});


const dataRef1 = firebase.database().ref().child('Graphs').child('Hospitals');
dataRef1.on('value', snap =>{
    dh=[];
    dict=snap.val();
 
    for (const [key, value] of Object.entries(dict)) 
    {
        dh.push({label:key, y: value });
    }

var chart = new CanvasJS.Chart("chartContainer1", {
    axisX:{
        
        interval: 1
    },
    title :{
        text: "Hospitals"
    },
    data: [{
        type: "line",
        dataPoints: dh
    }]
});
    chart.render();
});
const dataRef3=firebase.database().ref().child('Graphs')
dataRef3.on('value',snap=>{
    dict=snap.child('Latitude').val();
    dict1=snap.child('Longitude').val();
    for (const [key, value] of Object.entries(dict)) {
       var g= key.split(';');
       timestamps.push(g[0]);
       models.push(g[1]);
        carno.push(g[2]);
    }
       for (i=0;i<timestamps.length;i++)
       {
            lat.push(dict[timestamps[i]+';'+models[i]+';'+carno[i]]);
            long.push(dict1[timestamps[i]+';'+models[i]+';'+carno[i]]);
            
       }

    
    initmap();
});
const dataRef2 = firebase.database().ref().child('Graphs').child('Fire Stations');
dataRef2.on('value', snap =>{
    dfs=[]
    dict=snap.val();
    
    for (const [key, value] of Object.entries(dict)) 
    {
        dfs.push({label:key, y: value });
    }

var chart = new CanvasJS.Chart("chartContainer2", {
    axisX:{
        
        interval: 1
    },
    title :{
        text: "Fire Stations"
    },
    data: [{
        type: "line",
        dataPoints: dfs
    }]
});
    chart.render();

  
 
});

const psservices=firebase.database().ref().child("Graphs").child('Police Services');
const fsservices=firebase.database().ref().child("Graphs").child('Fire Station Services');
const hservices=firebase.database().ref().child("Graphs").child('Hospital Services');
psservices.on('value',snap=>{
    dict=snap.val();
    for (const [key, value] of Object.entries(dict)) 
    {
       psservice.push(key);
    }
});
fsservices.on('value',snap=>{
    dict=snap.val();
    for (const [key, value] of Object.entries(dict)) 
    {
       fsservice.push(key);
    }
});
hservices.on('value',snap=>{
    dict=snap.val();
    for (const [key, value] of Object.entries(dict)) 
    {
       hservice.push(key);
    }
});

var map;

function initmap()
{
   console.log(timestamps);
   console.log(models);
   console.log(carno);
   console.log(psservice);
   console.log(hservice);
   console.log(fsservice);
    var mapProp= {
        center:{lat:23.5936, lng:78.2227},
        zoom:5,
      };
       map = new google.maps.Map(document.getElementById("map"),mapProp);

      for (i=0;i<lat.length;i++) 
      {    
        var psf=0;
        var hf=0;
        var fsf=0;
          console.log(timestamps[i]+';'+models[i]+';'+carno[i]);
          if(psservice.includes(timestamps[i]+';'+models[i]+';'+carno[i])  )
          psf=1;
          if(hservice.includes(timestamps[i]+';'+models[i]+';'+carno[i]))
          hf=1;
          if(fsservice.includes(timestamps[i]+';'+models[i]+';'+carno[i]))
          fsf=1;
        
         setMarker(lat[i],long[i],models[i],timestamps[i],carno[i],psf,hf,fsf);
        }
 
      }

      setMarker = function(lat, lng,m,t,c,psf,hf,fsf) {
        console.log(psf,hf,fsf);
        var contentString="";
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
        });
        markers.push(marker);
        contentString ="<li>"+m+"</li>"+"<li>"+t+"</li>"+"<li>"+c+"</li>";
        if(psf==1)
        contentString+="<li>"+"Police"+"</li>";
        if(hf==1)
        contentString+="<li>"+"Hospital"+"</li>";
        if(fsf==1)
        contentString+="<li>"+"Fire Station"+"</li>";
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });
    }
    
    

    
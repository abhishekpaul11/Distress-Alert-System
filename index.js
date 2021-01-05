
function store()
{
    
    carno=document.getElementById('vehicleno').value;
     password=document.getElementById('password').value;
    localStorage.setItem('carnumber',carno);
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
         var database = firebase.database().ref().child(carno);
         database.on('value', snap =>{
         dictionary= snap.val();
         if(dictionary==null)
            window.alert("Enter a valid car no");
         else{
             pass=dictionary['Password'];
             if(pass==password){
              console.log(dictionary);
              window.open('dashboard.html','_self');
             }
              else
                window.alert("Enter a valid password");
         }
         });
    }       

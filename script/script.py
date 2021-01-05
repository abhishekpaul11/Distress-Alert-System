import speech_recognition as sr
from twilio.rest import Client 
import datetime
import pytz 
import string
from random import *
from firebase_admin import storage
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from gtts import gTTS
from pydub import AudioSegment
import time
import cv2
import os


flag = 0

#recognize keyword
r = sr.Recognizer() 
while True:
  try:  
    with sr.Microphone() as source2: 
      r.adjust_for_ambient_noise(source2, duration=0.2) 
      audio2 = r.listen(source2)
      MyText = r.recognize_google(audio2) 
      MyText = MyText.lower() 
      if "help" in MyText:
        print("DAS activated!")
        break
  except sr.RequestError as e: 
    print("Could not request results; {0}".format(e)) 
  except sr.UnknownValueError: 
    print("unknown error occured")

#take image
date = datetime.datetime.now(pytz.timezone("Asia/Kolkata"))
d = str(date)
d = d[2:4]+d[5:7]+d[8:10]+d[11:13] + d[14:16] + d[17:19]
fileName = "WB01657/Images/"+d+".jpg"

camera = cv2.VideoCapture(0)
return_value, image = camera.read()
cv2.imwrite(fileName, image)
del(camera)
print("Image taken!")

police = [{'Name':'Golabari Police Station','Location':'Golabari, Mali Panchghara','Latitude':22.594036823362774,'Longitude':88.34428784603759, 'Phone':1234567890},{'Name':'Kadam Tala Police Station','Location':'Kadam Tala','Latitude':22.593181927234372,'Longitude':88.32054255396241, 'Phone':1234567890}]
hospital = [{'Name':'ILS Hospital','Location':'Golabari, Mali Panchghara','Latitude':22.59343027306935,'Longitude':88.34446775396242, 'Phone':1234567890},{'Name':'Howrah Nursing Home','Location':'Howrah Maidan','Latitude':22.582519838267828,'Longitude':88.33118149257896, 'Phone':1234567890}]
firestation = [{'Name':'Howrah Fire Brigade','Location':'Golabari, Mali Panchghara','Latitude':22.590129296969977,'Longitude':88.33630403246678, 'Phone':1234567890},{'Name':'Shibpur Fire Station','Location':'Shibpur','Latitude':22.571785517704843,'Longitude':88.32668666138345, 'Phone':1234567890}]

account_sid = "" #enter sid
auth_token = "" #enter auth token
client = Client(account_sid, auth_token)

location = 'http://maps.google.com/maps?q='+str('22.591793557536757')+','+str('88.33855389723483')+'&ll='+str('22.591793557536757')+','+str('88.33855389723483')+'&z=20'
name = 'Vivek Jagannath'
car = 'Honda BRV'
number = 'WB 01 657'
num = 'WB01657'
date = date.strftime("%c")

cred = credentials.Certificate('') #firebase json here

if not firebase_admin._apps:
  firebase_admin.initialize_app(cred, {
      'databaseURL': '', #database url
      'storageBucket' : "" #storage bucket
  })
else:
  firebase_admin.get_app()

bucket = storage.bucket("das-honda.appspot.com")
blob = bucket.blob(fileName)
blob.upload_from_filename(fileName)
blob.make_public()

characters = string.digits
password =  "".join(choice(characters) for x in range(randint(8, 10)))

ref = db.reference('WB01657')
ref.update({
  'Image':blob.public_url,
  'Password': password,
  'Model': 'Honda BRV',
  'Timestamp': str(date)
})
ref.child('Flags').update({
  'psflag': 0,
  'hflag': 0,
  'fsflag': 0
})
ref1 = db.reference('Graphs')
ref1.child('Latitude').update({str(date)+';Honda BRV;WB01657': '22.591793557536757'})
ref1.child('Longitude').update({str(date)+';Honda BRV;WB01657': '88.33855389723483'})


msg = 'This is an automated distress message generated from '+name+'\'s '+car+'.\n\n*Location:* '+location+'\n*Date and Time:* '+str(date)+'\n*Car Number:* '+number+'\n\nThe image attached is a picture of the scenario within the car. Please contact the necessary emergency service.'
msg1 = '\n\nThis is an automated distress message generated from '+name+'\'s '+car+'.\n\nLocation: '+location+'\n\nDate and Time: '+str(date)+'\n\nCar Number: '+number+'\n\nThe image link attached is a picture of the scenario within the car. Please contact the necessary emergency service.\n\n'+blob.public_url
image=blob.public_url
link='https://arnold2381.github.io/DAS/'
follow = 'For live location tracking, click on: '+link+'\nLogin ID: '+num+'\nPassword: '+password

message = client.messages.create( 
                              from_='',  
                              body=msg, 
                              media_url=image,
                              to='' 
                          ) 
message = client.messages.create( 
                              from_='',  
                              body=msg1, 
                              to='' 
                          )
message = client.messages.create( 
                              from_='',  
                              body=follow,
                              to='' 
                          )
message = client.messages.create( 
                              from_='',  
                              body=follow,
                              to='' 
                          )
print("Messages sent!")

#voice recording
text = "Distress alert sent. Do you want to send a voice message?"
language = 'en'
speech = gTTS(text = text, lang = language, slow = False)
speech.save("text.mp3")

os.system("mpg123 text.mp3")

with sr.Microphone() as source2: 
  r.adjust_for_ambient_noise(source2, duration=0.2) 
  audio2 = r.listen(source2)
  MyText = r.recognize_google(audio2) 
  MyText = MyText.lower() 
  if "yes" in MyText:
    p = sr.Recognizer()
    text = "You may start."
    language = 'en'
    speech = gTTS(text = text, lang = language, slow = False)
    speech.save("text.mp3")
    os.system("mpg123 text.mp3")
    with sr.Microphone() as source:
        print("start")
        p.adjust_for_ambient_noise(source, duration=0.5)
        audio = p.listen(source)
    print("done")
    with open("audio.wav", "wb") as f:
        f.write(audio.get_wav_data())
    print("saved")
    AudioSegment.from_wav("audio.wav").export("WB01657/Audio/"+d+".mp3", format="mp3")
    os.system("rm audio.wav")
    flag = 1

print("Voice message prompt exited")

if flag == 1:
  blob1 = bucket.blob("WB01657/Audio/"+d+".mp3")
  blob1.upload_from_filename("WB01657/Audio/"+d+".mp3")
  blob1.make_public()
  
characters = string.digits
password =  "".join(choice(characters) for x in range(randint(8, 10)))

ref = db.reference('WB01657')
if flag == 1:
  ref.update({
        'Audio':blob1.public_url
    })
else:
  ref.update({
        'Audio': 'NIL'
    })

if flag == 1:
  audio_msg = 'The attached link is the audio message from Vivek:\n'+blob1.public_url
  message = client.messages.create( 
                              from_='',
                              media_url=blob1.public_url,
                              to='' 
                          )
  message = client.messages.create( 
                              from_='',  
                              body=audio_msg, 
                              to='' 
                          )

  print("Voicemail sent!")
  text = "Voicemail sent"
  language = 'en'
  speech = gTTS(text = text, lang = language, slow = False)
  speech.save("text.mp3")

  os.system("mpg123 text.mp3")

index=0
for i in range(100):
  x=int(i)
  i=0.00001*i
  ref.child('Car').update({
      'Latitude': 22.591793557536757+i, 
      'Longitude': 88.33855389723483+i,
  })
  if(x==75 or x==99):
    ref.child('Police Station').update({
      'Name': police[index]['Name'],
      'Location': police[index]['Location'],
      'Latitude': police[index]['Latitude'],
      'Longitude': police[index]['Longitude'],
      'Phone': police[index]['Phone']
    })
    ref.child('Hospitals').update({
      'Name': hospital[index]['Name'],
      'Location': hospital[index]['Location'],
      'Latitude': hospital[index]['Latitude'],
      'Longitude': hospital[index]['Longitude'],
      'Phone': hospital[index]['Phone']
    })
    ref.child('Fire Station').update({
      'Name': firestation[index]['Name'],
      'Location': firestation[index]['Location'],
      'Latitude': firestation[index]['Latitude'],
      'Longitude': firestation[index]['Longitude'],
      'Phone': firestation[index]['Phone']
    })
    index=1

#Sent to
message = client.messages.create( 
                              from_='',  
                              body="These messages have also been sent to Piyush Goel(0123456789) and Abhishek Paul(1234567890)", 
                              to='' 
                          ) 
message = client.messages.create( 
                              from_='',  
                              body="These messages have also been sent to Piyush Goel(0123456789) and Abhishek Paul(1234567890)", 
                              to='' 
                          )
  
os.system("rm "+fileName+" text.mp3")
if(flag==1):
  os.system("rm WB01657/Audio/"+d+".mp3")
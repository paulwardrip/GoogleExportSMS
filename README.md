# GoogleExportSMS
Convert a Hangouts or Voice backup into an SMS backup for Android using SMS Backup and Restore.

# Instructions for All
* Run npm install in the base directory.
* Edit config.json to put your name and number.
* Install SMS Backup and Restore on your Android device.
* Backup your SMS messages to Dropbox / Google Drive
* Go To: https://takeout.google.com/settings/takeout
* Click Select None to clear everything, then select Contacts and Hangouts/Voice and proceed to export the data.

# Hangouts
* Copy All Contacts.vcard and Hangouts.json into the /hangouts/ directory.
* Copy the sms-20xxxxxxxxxxxx.xml in Dropbox / Google Drive to a new file with the current time that will appear to be the latest backup.
* Execute converter.js with node.js.
* Open the sms-20xxxxxxxxxxxx.xml created in /hangouts/ and copy all the sms elements, paste them into the sms xml that you created in Dropbox / Google Drive.
* If you also need to do Voice proceed to those steps, but don't create a new sms xml file in Dropbox / Google Drive, use the same one you created for Hangouts.
* Wait for the file to upload to cloud storage, then import with SMS backup and restore.
* Congrats, you now have all your Hangouts messages available in any SMS app you want to use.

# Voice
* This executes in 2 parts, a node script that consolidates all the data into one html (from many html + vcard). The second part runs in the browser, the parsing was much easier/faster to write in jquery vs using node packages, many of which choked on parsing it. It's a little clunky but it works.
* Copy All Contacts.vcard and the Calls directory into the /voice/ directory.
* Copy the sms-20xxxxxxxxxxxx.xml in Dropbox / Google Drive to a new file with the current time that will appear to be the latest backup.
* Execute voice.js with node.js.
* Execute 'grunt connect'
* Go to http://localhost:8765/
* When the script has finished click "Download XML" and open the file, then copy all the sms elements ... or expand the textarea on the left and copy all the sms elements.
* Paste the elements into the sms xml that you created in Dropbox / Google Drive.
* Wait for the file to upload to cloud storage, then import it with SMS backup and restore.
* Congrats, you now have all your Google Voice messages available in any SMS app you want to use.

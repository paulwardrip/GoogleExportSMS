# hangouts-to-sms
Convert Hangouts backup into an sms backup for importing into SMS backup and restore.
If you want to get your messages out of Google Hangouts and put them back into your phone's SMS storage:
* Install SMS backup and restore
* Backup your sms messages to Dropbox or Google Drive
* Go To: https://takeout.google.com/settings/takeout
* Click Select None to clear everything, then select Contacts and Hangouts and proceed to export the data.
* Put All Contacts.vcard and Hangouts.json into the directory where this script is checked out.
* Edit converter.js to put your number in mynumber variable.
* Execute converter.js with node.js.
* Open the sms backup xml you created, copy all the sms elements and paste them into the backup.xml that was created.
* Copy the backup.xml file to wherever you have SMS backup and restore pointed and rename it so it appears to be the latest backup, ex: sms-20170812200633.xml
* Import with SMS backup and restore
* Congrats, you now have all your Hangouts messages to import into another app.

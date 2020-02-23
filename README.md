# (Photo)report Maker
Web application (for local network) to make annoying reports which are asked by our director (or by her bosses). Now it's fast and simple and takes not more than 5 minutes (with printing).
The only kind of report I need to make is photoreport, my colleagues need other kinds of reports, so the program can be expanded to their needs. To make photo-report you need to choose or drag and drop few photos (the best variant is 6 and that's what we actually do), and they will automatically be posted to the form (in 2 Bootstrap columns). Photos can be big, the program will scale them to appropriate size and save to database (to MongoDB as binary) so you can edit reports later and change photos. There are also fields for text (header, footer and photos' captions). As a result, you will get html of printable size, which you can save as PDF (with browser functionality), it will be saved to a database for farther needs or edits.

![Image](https://github.com/Hexronimo/reports-maker/raw/master/reportmaker.jpg)

## Tools and technologies used
It's REST application so all reports are saved as BSON objects in MongoDB. At front end I used Vue.js with BootstrapVue. 
* Java
* Springboot
* RestController (everything was made with repositories)
* MondoDB
* Vue (no modules, no axios, very basic functionality to add data reactiveness)
* Vue resource https://github.com/pagekit/vue-resource (just awesome!)
* BootstrapVue
* Maven

## Installation
1) You need Java JDK 11 and Maven to compile sources 
2) Install mongodb on your server (Installation guides https://docs.mongodb.com/manual/administration/install-community/) run its service
3) Look at app properties file https://github.com/Hexronimo/reports-maker/blob/master/src/main/resources/application.properties then change DB name and user's credentials if you want, then create a database and administrative user with these names. Instruction are here https://docs.mongodb.com/manual/tutorial/enable-authentication/#create-the-user-administrator
4) run `mvn package` in the directory where pom.xml is (you need Maven to do it) to build .jar file (it will be in /target dir)
5) run `java -jar reportmaker-1.0-SNAPSHOT.jar` to run application. If you have problems with Java version at this step, read this (only for Ubuntu) https://attacomsian.com/blog/change-default-java-version-ubuntu 
6) don't forget to start MongoDB `sudo service mongod start`
7) now open browser and you can access app at http://localhost:8080/reports-maker/index.html

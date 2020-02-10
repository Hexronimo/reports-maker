Памятка для себя по созданию Rest приложения

Делай все в Eclipse потому что в идее не будут сохраняться файлы js, если они понадобятся

* Создай пустой Maven проект (без пресета)
* Добавь туда 
    
    `<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.2.RELEASE</version>
    </parent>`
     
 * Если нужно создать исполняемый jar-файл при сборке, то ещё надо добавить:

    `<packaging>jar</packaging>`
 
 * В dependencies добавить:
 
     * Для веб-приложения (MVC, Servlet API, Spring Core, Spring web и т.д.)
 
     `<dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-web</artifactId>
     </dependency>`
     
     * Для Themeleaf (темплейты *.html класть в src/main/resources/templates)
     
     `<dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
     </dependency>`
     
     * Для того чтобы при разработке видеть изменения немедленно без перезапуска.
     Нужно только на этапе разработки
     	
     `<dependency>
     	<groupId>org.springframework.boot</groupId>
     	<artifactId>spring-boot-devtools</artifactId>
     	<optional>true</optional>
     </dependency>`

    * Для MongoDB в которой можно сохранять JSON объекты нужно добавить
        <dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-mongodb</artifactId>
		</dependency>

        кроме того чтобы ею пользоваться надо добавить файл application.propreties в /resources
        с таким содержанием:
        `spring.data.mongodb.host=localhost
        spring.data.mongodb.port=27017
        spring.data.mongodb.authentication-database=admin
        spring.data.mongodb.username=123
        spring.data.mongodb.password=123
        spring.data.mongodb.database=reportsdb`

        Установка и настройка mongo элементарная и описана у них на сайте,
        чтобы сделать базу на монго надо написать 
        `mongo
        use название-бд`
        чтобы узнать какой порт слушает `sudo lsof -iTCP -sTCP:LISTEN | grep mongo`
        чтобы юзера с паролем создать (в отдельную базу пользователей добавляется JSON этого юзера):
        `use admin
        db.createUser(
        {
            user: "myUserAdmin",
            pwd: passwordPrompt(), // or cleartext password
            roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
        }
        )`     
     
 * Плагин
     
     `<build>
         <plugins>
             <plugin>
                 <groupId>org.springframework.boot</groupId>
                 <artifactId>spring-boot-maven-plugin</artifactId>
             </plugin>
         </plugins>
     </build>`
 
* Дальше нужно создать объект модели с геттерами и сеттерами, ну в общем как обычно, и поставить ему аннотацию @Document
* Потом создать репозиторий - список объектов (наследуется от MongoRepository<Класс модели, ObjectId>) с аннотацией @Repository, id в монго генерируется с помощью объекта ObjectId. Чтобы ObjectId нормально работало и выглядело в адресной строке, нужно добавить метод в классы модели:
    public String getId() {
    	  return id.toHexString();
    }
* Создать Application стандартный для спрингбута, ничего нового
* Создать контроллер с аннотацией @RestContoller. В конструкторе контроллера нужно инициализировать репозиторий, он будет типо автовайреда, хотя это не нужно писать. Он сам загрузит все из базы данных. В контроллере описываются основные методы @PostMapping - добавить запись, @PutMapping - обновить значения существующей, @DeleteMapping - удалить. 
* Протестировать методы можно через консоль браузера (у меня работает только в Chromium): 
    * добавить объект:
`fetch ('/reports-maker/reports', { method:'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'День города', dateStart: '09-06-2019', dateEnd: 'null'})}).then(result => console.log(result))`
    * удалить объект
`fetch ('/reports-maker/reports/5e1aeef095aab63170dc3b89', { method:'DELETE'}).then(result => console.log(result))`
    * апдейтнуть объект
`fetch ('/reports-maker/reports/5e1af62f95aab63170dc3b99', { method:'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: '5e1af62f95aab63170dc3b99', name: 'День рождения', dateStart: '09-06-2019', dateEnd: 'null'})}).then(result => console.log(result))`  

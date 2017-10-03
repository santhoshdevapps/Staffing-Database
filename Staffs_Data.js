/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	//  Name : Santhosh Damodharan
	//     student Id : 300964037
	//     File Name : Staff_database
	//     Description : Created staffing database to handle multiple staffs at an organization
	//     version : 1.0
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var SERVER_NAME = 'Staff-api'
var PORT = 8000;
var HOST = '127.0.0.1';

var filename = 'Database_Storage.json';
var fs = require('fs');

var data = fs.readFileSync(filename);
var staff_data_JSON = JSON.parse(data);


var getRequestCounter = 0;
var postRespnseCounter = 0;


var restify = require('restify')

  // Get a persistence engine for the users
  , staffsSave = require('save')('staffs')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  //console.log('Server %s listening at %s', server.name, server.url)
  console.log("Server is listening on: " + HOST + ":" + PORT);
  console.log("End Points :");
  console.log( HOST + ":" + PORT +"/sendGet   method: GET");
  console.log( HOST + ":" + PORT +"/sendPost   method: POST");
  console.log( HOST + ":" + PORT +"/sendDelete   method: DELETE");
  
  console.log(staff_data_JSON);

  console.log('Resources:')
  console.log(' /staffs')
  console.log(' /staffs/:id')  
})

server
// Allow the use of POST
.use(restify.fullResponse())

// Maps req.body to req.params so there is no switching between them
.use(restify.bodyParser())



/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                       // Created a new staff record
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
server.post('/sendPost', function (req, res, next) {
  
      console.log("sendPost: sending response...");
    
      //Request counter for sendPostrequest 
      postRespnseCounter++;
      
      console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
        
    // Make sure name is defined
    if (req.params.name === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.age === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new restify.InvalidArgumentError('age must be supplied'))
    }
    var newStaff = { 
          name: req.params.name, 
          age: req.params.age,
          _id: req.params._id
      }
  
    // Create the user using the persistence engine
    staffsSave.create( newStaff, function (error, staff) {
  
      //Writing data in JSON file

        staff_data_JSON[req.params.name] = req.params.age;
      
        var write_data = JSON.stringify(staff_data_JSON,null,2);

        fs.writeFile(filename,write_data,finished);

        function finished(err) {console.log('Data stored in json file');}

      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send the user if no issues
      res.send(201, staff)
    })
  })




/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                      // Get all student records in the system
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

        server.get('/sendGet', function (req, res, next) {
  
        console.log("sendGet: received request..");

        //Request counter for endpoint sendGet 
        getRequestCounter++;
        
        console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
          

        // Find every entity within the given collection
        staffsSave.find({}, function (error, staffs) {

        // Return all of the Staffs in the system
        //res.send(staffs)


        console.log(staff_data_JSON);

         res.send(staff_data_JSON);

       })
    })
    
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                      // Get a single user by their staff id
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

      server.get('/Staffs/:id', function (req, res, next) {

        // Find a single user by their id within save
        staffsSave.findOne({ _id: req.params.id }, function (error, staffs) {
    
          getRequestCounter++;
          
          console.log("Processed Request Counter -> sendGet : " + getRequestCounter + ", sendPost : " + postRespnseCounter);
          
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        if (staffs) {
          // Send the user if no issues
          res.send(staffs)
        } else {
          // Send 404 header if the user doesn't exist
          res.send(404)
        }
      })
    })


	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                      // Update a Staff Record by their id
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

      server.put('/staffs/:id', function (req, res, next) {
      
        // Make sure name is defined
        if (req.params.name === undefined ) {
          // If there are any errors, pass them to next in the correct format
          return next(new restify.InvalidArgumentError('name must be supplied'))
        }
        if (req.params.age === undefined ) {
          // If there are any errors, pass them to next in the correct format
          return next(new restify.InvalidArgumentError('age must be supplied'))
        }
        
        var newStaff = {
              _id: req.params.id,
              name: req.params.name, 
              age: req.params.age
          }
        
          // Update the user with the persistence engine
          staffsSave.update(newStaff, function (error, staff) {
      
          // If there are any errors, pass them to next in the correct format
          if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
      
          // Send a 200 OK response
          res.send(200)
        })
      })
      
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                       // Delete staff record with the given id
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

server.del('/staffs/:id', function (req, res, next) {
  
    // Delete the user with the persistence engine
    staffsSave.delete(req.params.id, function (error, staff) {
  
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send a 200 OK response
      res.send(200)
    })
  })
  
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                      // Delete all staff records in the system
	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

server.get('/sendDelete', function (req, res, next) {
  
        console.log("sendDelete: received request..");

        // Find every entity within the given collection

        //staffsSave.delete({}, function (error, staff) {
          

        staffsSave = require('save')('staffs')

        res.send("All Records Delete");
    //    localStorage.clear();
        
      //    fs.truncate(filename, 0, function(){console.log('delete.')})

 //      Send a 200 OK response
       })
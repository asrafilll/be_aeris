var axios = require('axios')
var util = require('util');
var futil = require('../config/utility.js');
const {Client} = require("@googlemaps/google-maps-services-js");

require('dotenv').config();

var AssetByID = async function(req,res){

  var access_token = process.env.TOKEN_AERTRAK
  var url_assets = process.env.URL_ASSET_AERTRACK + '/' + req.params.sclId

  futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS ] | INFO ' + util.inspect('ASSETS'));  
  futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS ] | INFO ' + util.inspect(url_assets)); 

  const config = {
      headers:{
          token : access_token
      }
    }
    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 

    await axios.get(url_assets,config)
    .then(function (response_assets) {
       // console.log(response_assets.data)
       futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response_assets.data)); 
           var result = {
           "status":true,
           "message":"success",
           "data": response_assets.data
       }

       res.setHeader("Content-Type", "application/json");
       res.writeHead(200);
       res.end(JSON.stringify(result));

    }) 
    .catch(function (error) {
       if (error.response) {
           // The request was made and the server responded with a status code
           // that falls out of the range of 2xx
           futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
           futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
           futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
           // console.log(error.response.data);
           // console.log(error.response.status);
           // console.log(error.response.headers);
         } else if (error.request) {
           // The request was made but no response was received
           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
           // http.ClientRequest in node.js
           futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
           // console.log(error.request);
         } else {
           // Something happened in setting up the request that triggered an Error
           // console.log('Error', error.message);
           futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
         }
         futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

         var result = {  

           "status":false,
           "message": 'ERROR CONNECTION'
       }
       res.setHeader("Content-Type", "application/json");
       res.writeHead(400);
       res.end(JSON.stringify(result,null,3));
    })

  
}

var AllAssets = async function(req,res){
 

        var access_token = process.env.TOKEN_AERTRAK
        var url_assets = process.env.URL_ASSET_AERTRACK

        futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS ] | INFO ' + util.inspect('ASSETS'));  
        futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS ] | INFO ' + util.inspect(url_assets)); 

        const config = {
            headers:{
                token : access_token
            }
          }

        futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 

        await axios.get(url_assets,config)
         .then(function (response_assets) {
            // console.log(response_assets.data)
            futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response_assets.data)); 
                var result = {
                "status":true,
                "message":"success",
                "data": response_assets.data
            }

            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result));

         }) 
         .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
                // console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
              }
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

              var result = {  

                "status":false,
                "message": 'ERROR CONNECTION'
            }
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result,null,3));
         })

       


 }


 var AllAssets1 = async function(req,res){
    
    var moving_counter = 0
    var stopped_counter = 0
    var offline_counter = 0

    var access_token = process.env.TOKEN_AERTRAK
    var url_assets = process.env.URL_ASSET_AERTRACK

    futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS ] | INFO ' + util.inspect('ASSETS'));  
    futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS ] | INFO ' + util.inspect(url_assets)); 

    const config = {
        headers:{
            token : access_token
        }
      }

    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 

   let res1 = await axios.get(url_assets,config)

     .then(function (response_assets) {
        // console.log(response_assets.data)
        futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response_assets.data)); 
        //     var result = {
        //     "status":true,
        //     "message":"success",
        //     "data": response_assets.data
        // }

        // res.setHeader("Content-Type", "application/json");
        // res.writeHead(200);
        // res.end(JSON.stringify(result));
        return response_assets.data
     }) 
     .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
            // console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
          }
          futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

          var result = {  

            "status":false,
            "message": 'ERROR CONNECTION'
        }
        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify(result,null,3));
     })

    //  console.log(res1.length)

     for (j=0;j<= res1.length-1;j++)
     {
        var url_latest_status = process.env.URL_LATEST_STATUS_AERTRACK +'accountId='+ res1[j].accountId +'&includeHierarchy =false&sclId='+ res1[j].sclId ;
        // console.log(url_latest_status)

        let res2 = await axios.get(url_latest_status,config)
        .then(function (response_latest_status) {
            //console.log(response_latest_status.data[0])
            var deviceStatus = response_latest_status.data[0].deviceStatus
            return deviceStatus
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
                // console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
              }
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));
    
              var result = {  
    
                "status":false,
                "message": 'ERROR CONNECTION'
            }
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result,null,3));
         })

         if(res2 == 'moving'){
            moving_counter++
        }else if(res2 == 'stopped'){
            stopped_counter++
        }else if(res2 == 'offline'){
            offline_counter++
        }

        res1[j].deviceStatus = res2
     }
    
     futil.logger.debug('\n' + futil.shtm() + '- [ MOVING COUNTER] | INFO ' + util.inspect(moving_counter)); 
     futil.logger.debug('\n' + futil.shtm() + '- [ STOPPED COUNTER] | INFO ' + util.inspect(stopped_counter)); 
     futil.logger.debug('\n' + futil.shtm() + '- [ OFFLINE COUNTER ] | INFO ' + util.inspect(offline_counter)); 

     futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(res1)); 
     var result = {
     "status":true,
     "message":"success",
     "data": res1
    }

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(result));
}

var LatestStatus = async function(req,res){

        var access_token = process.env.TOKEN_AERTRAK
        var accountId = process.env.ACCOUNTID
        var sclId = req.params.sclId

        var url_latest_status = process.env.URL_LATEST_STATUS_AERTRACK +'accountId='+ accountId +'&includeHierarchy =false&sclId='+ sclId ;

        futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS LATEST STATUS ] | INFO ');  
        futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS LATEST STATUS ] | INFO ' + util.inspect(url_latest_status)); 

        const config = {
            headers:{
                token : access_token
            }
          }

        futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 
        
        await axios.get(url_latest_status,config)
        .then(function (response_latest_status) {

            futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response_latest_status.data)); 
            var result = {
                "status":true,
                "message":"success",
                "data": response_latest_status.data
            }

            futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE RESULT] | INFO ' + util.inspect(result)); 

            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result));

        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
                // console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
              }
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

              var result = {  

                "status":false,
                "message": 'ERROR CONNECTION'
            }
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result,null,3));
         })


}



var LatestStatus1 = async function(req,res){
    var access_token = process.env.TOKEN_AERTRAK
    var accountId = process.env.ACCOUNTID
    var url_latest_status = process.env.URL_LATEST_STATUS_AERTRACK +'accountId='+ accountId +'&includeHierarchy =false'

    futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS LATEST STATUS ] | INFO ');  
    futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS LATEST STATUS ] | INFO ' + util.inspect(url_latest_status)); 

    const config = {
        headers:{
            token : access_token
        }
      }

    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 
    let res1 = await axios.get(url_latest_status,config)
        .then(function (response) {

            
            futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response.data)); 
            var result = {
                "status":true,
                "message":"success",
                "data": response.data
            }

            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result));

            // return response.data

        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
                // console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
              }
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

              var result = {  

                "status":false,
                "message": 'ERROR CONNECTION'
            }
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result,null,3));
         })

       
         

        //  var apiKey = process.env.MAP_KEY

        //  for(i=0;i<=res1.length-1;i++){
        //     var lat = res1[i].validLatitude
        //     var lng = res1[i].validLongitude
        //     if(!lat && !lng){
        //         futil.logger.debug('\n' + futil.shtm() + '- [ ERROR LOCATION]  ' );
        //     }else{
        //         let res2 = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)
        //         .then(response => {
        //             // console.log(response.data.results[0].formatted_address);
        //             // console.log(res1[i])
                    
        //             futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response)); 
        //             return response.data.results[0].formatted_address
                   
        //         })
        //         .catch(error => {
        //             console.log(error);
        //         })

        //         res1[i].validAddress = res2
        //     }
            
        //     // break;
        //  }

        // //  console.log(res1)

        // futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(res1)); 
        // var result = {
        // "status":true,
        // "message":"success",
        // "data": res1
        //  }

        // res.setHeader("Content-Type", "application/json");
        // res.writeHead(200);
        // res.end(JSON.stringify(result));


}

var AssetAddress = async function(req,res) {
    var lat = req.params.lat
    var lng = req.params.lng
    var apiKey = process.env.MAP_KEY

    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)
    .then(response => {
                    futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response)); 
                    var validAddress = response.data.results[0].formatted_address
                    
                    var result = {
                    "status":true,
                    "message":"success",
                    "data": validAddress
                     }

                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(result));
    })
    .catch(error => {
            console.log(error);
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | INFO ' + util.inspect(error)); 
                                
            var result = {
                "status":false,
                "message":"failed"
                 }

                res.setHeader("Content-Type", "application/json");
                res.writeHead(400);
                res.end(JSON.stringify(result));
     })
}

var History = async function(req,res){

    var token = process.env.TOKEN_AERTRAK
    var sclId = req.body.sclId
    var createdBefore = req.body.createdBefore
    var createdAfter = req.body.createdAfter
    // var limit = req.body.limit
    var accountId = process.env.ACCOUNTID


    // var url_history = process.env.URL_ASSET_HISTORY + sclId + "/data?createdBefore="+ createdBefore + "&createdAfter="+ createdAfter +"&accountId="+ accountId +"&limit="+ limit +"&count=true"
    var url_history = process.env.URL_ASSET_HISTORY + sclId + "/data?createdBefore="+ createdBefore + "&createdAfter="+ createdAfter +"&accountId="+ accountId 

    futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS HISTORY ] | INFO ' );  
    futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS HISTORY ] | INFO ' + util.inspect(url_history));
    
    const config = {
      headers:{
          token : token
      }
    }

    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 

    axios.get(url_history,config)
         .then(function (response_assets) {
          futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response_assets.data)); 

          // var j= 1
          var data = response_assets.data


          // for (i=0;i<= data.length-1;i++){
          //   data[i].no = j
          //   data[i].speed = data[i].speed /1000
          //   j++
          // }

          var result = {
            "status":true,
            "message":"success",
            "data": data
          }

          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify(result));

         }).catch(function (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
              // console.log(error.response.data);
              // console.log(error.response.status);
              // console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
              // console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              // console.log('Error', error.message);
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
            }
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

            var result = {  

              "status":false,
              "message": 'ERROR CONNECTION'
          }
          res.setHeader("Content-Type", "application/json");
          res.writeHead(400);
          res.end(JSON.stringify(result,null,3));
       })

}

var StatusCount = async function(req,res){

    var url_status_count = process.env.URL_STATUS_COUNT_AERTRACK;
    var token = process.env.TOKEN_AERTRAK


    futil.logger.debug('\n' + futil.shtm() + '- [ ASSETS STATUS COUNT ] | INFO ' );  
        futil.logger.debug('\n' + futil.shtm() + '- [ URL ASSETS COUNT ] | INFO ' + util.inspect(url_status_count)); 

        const config = {
            headers:{
                token : token
            }
          }

        futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADER] | INFO ' + util.inspect(config)); 

        axios.get(url_status_count,config)
         .then(function (response_assets) {
            // console.log(response_assets.data)
            futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE BODY] | INFO ' + util.inspect(response_assets.data)); 
                var result = {
                "status":true,
                "message":"success",
                "data": response_assets.data
            }

            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result));

         }) 
         .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
                // console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
              }
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));

              var result = {  

                "status":false,
                "message": 'ERROR CONNECTION'
            }
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result,null,3));
         })


  
}

module.exports = {
    AssetByID,
    AllAssets,
    AllAssets1,
    AssetAddress,
    LatestStatus,
    LatestStatus1,
    StatusCount,
    History
 }
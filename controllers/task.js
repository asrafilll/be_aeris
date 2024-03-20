// var ModelTask = require('../models/task.js')
// var Task = ModelTask.Task
const db = require("../models");
var sequelize = require('sequelize')
const { Op } = require('sequelize');
var ModelTask = require('../models/task.js')
var Task = ModelTask.Task
var ModelUser = require('../models/user.js')
var User = ModelUser.User
const path = require("path");
// const multer = require("multer");
// const upload = multer({ dest: "public/uploads" });

// const fileUpload = require('express-fileupload');

var util = require('util');
var futil = require('../config/utility.js');
const { stat } = require('fs/promises');
var result = {
    "code":"",
    "status":""
}

var Create = async function(req,res){
    try {
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS ] | INFO ' + util.inspect(req.headers));
        const task = await Task.create(req.body);
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT TASK CREATE] | QUERING ' + util.inspect(task));
        result.code = 200
        result.status ="success"
        result.data = "New data inserted"
        res.send(result);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Insert data failed"
        res.send(result);
    }
}


var Read = async function(req,res){
    try {

        

        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS ] | INFO ' + util.inspect(req.headers));
        // futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  page] | INFO ' + util.inspect(req.headers.page));
        // futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  rows] | INFO ' + util.inspect(req.headers.rows));
        // futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  offset] | INFO ' + util.inspect(req.headers.offset));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  createdby] | INFO ' + util.inspect(req.headers.createdby));

        // var createdby = parseInt(req.headers.createdby)

        const count = await Task.count({
            // where: {
            //     createdBy: createdby
            // }
        });

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT COUNT ] | QUERING ' + util.inspect(count));

        // var limit = parseInt(req.headers.rows)
        // var offset = parseInt(req.headers.offset)
        // var page = parseInt(req.headers.page)
        // var createdby = parseInt(req.headers.createdby)

        //update status overdue
        await UpdateStatus()
        // futil.logger.debug('\n' + futil.shtm() + '- [ UPDATE STATUS ] | QUERING ' + util.inspect(res_update));

        
        var resp = await Task.findAll({ raw:true,
          
           
           order: [
            ['id', 'ASC'],
           
            ]
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT TASK] | QUERING ' + util.inspect(resp));
        // var rows_data = []
        // rows_data.push(result)
        offset = 0;
        var j
        if (offset == 0 ){
            j=1
        }else{
            j= (offset * (page-1))+1
        }

        for (i=0;i<=resp.length-1;i++){
            var status = 0
            var task_status = resp[i].task_status
            
            if (task_status == 'In Complete'){
                status = 1
            }else if (task_status == 'Overdue'){
                status = 2
            }else if ( task_status == 'In Progress'){
                status = 3
            }else if(task_status =='Complete'){
                status = 4
            }
            resp[i].status = status 
            resp[i].no = j
            j++
        }



        var response = {"total":count,"rows":resp}   
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT RESPONSE] | QUERING ' + util.inspect(response));  
        result.code = 200
        result.status ="success"
        result.data = response
        res.send(result);
    //     res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}


var ReadTotalStatusPerUser = async function (req,res){
    try {
        const task = await Task.findAll({
            group: [ 'task_status' ],
            attributes :['task_status',
                [sequelize.fn('COUNT', sequelize.col('task_status')), 'total'],
            ],
            where: { userid: req.params.id }
        });

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(task));
        result.code = 200
        result.status ="success"
        result.data = task
        res.send(result);
        // res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}


var ReadTaskByStatus = async function(req,res){
    try {

        

        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS ] | INFO ' + util.inspect(req.headers));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  page] | INFO ' + util.inspect(req.headers.page));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  rows] | INFO ' + util.inspect(req.headers.rows));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  offset] | INFO ' + util.inspect(req.headers.offset));

        const count = await Task.count();

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT COUNT ] | QUERING ' + util.inspect(count));

        // var limit = parseInt(req.headers.rows)
        // var offset = parseInt(req.headers.offset)
        // var page = parseInt(req.headers.page)
        var status = req.params.status
        futil.logger.debug('\n' + futil.shtm() + '- [ TASK STATUS ] | QUERING ' + util.inspect(status));
        //update status overdue
        await UpdateStatus()
        // futil.logger.debug('\n' + futil.shtm() + '- [ UPDATE STATUS ] | QUERING ' + util.inspect(res_update));

        
        var resp = await Task.findAll({ raw:true,
            // include: [{
            //     model: User,
            //     as: 'users',
            //     attributes: ['username']
            // }],
           where: { task_status: status },
           order: [
            ['id', 'ASC'],
           
            ]
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT TASK] | QUERING ' + util.inspect(resp));
        // var rows_data = []
        // rows_data.push(result)
        offset=0
        var j
        if (offset == 0 ){
            j=1
        }else{
            j= (offset * (page-1))+1
        }

        for (i=0;i<=resp.length-1;i++){
            var status = 0
            var task_status = resp[i].task_status
            
            if (task_status == 'In Complete'){
                status = 1
            }else if (task_status == 'Overdue'){
                status = 2
            }else if ( task_status == 'In Progress'){
                status = 3
            }else if(task_status =='Complete'){
                status = 4
            }
            resp[i].status = status 
            resp[i].no = j
            j++
        }



        var response = {"total":count,"rows":resp}   
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT RESPONSE] | QUERING ' + util.inspect(response));  
        result.code = 200
        result.status ="success"
        result.data = response
        res.send(result);
    //     res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var TaskFilter = async function (req,res){
    try{
        const task = await Task.findAll({
            where: { 
                userid: req.params.id,
                task_date: new Date(req.body.task_date),
                task_status: req.body.task_status,
                task_type: req.body.task_type
            }
        });

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(task));
        result.code = 200
        result.status ="success"
        result.data = task
        res.send(result);
    }catch (err){
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var ReadTaskUser = async function(req,res){
    try {
        const task = await Task.findAll({
            where: { userid: req.params.id }
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(task));
        result.code = 200
        result.status ="success"
        result.data = task
        res.send(result);
        // res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var Update = async function (req,res){
    try {

        // futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST BODY ] | INFO ' + util.inspect(req.body));

        let sampleFile;
        let uploadPath;
      
        if (!req.files || Object.keys(req.files).length === 0) {
            //   return res.status(400).send('No files were uploaded.');
            // update tanpa image

            futil.logger.debug('\n' + futil.shtm() + '- [ UPDATE TANPA IMAGE ]');

            const task = await Task.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            
            result.code = 200
            result.status ="success"
            result.data = "Update data success"
            res.send(result);

        }else{

            sampleFile = req.files.image_task;
            uploadPath = path.join(__dirname , '../public/uploads/' , sampleFile.name);

            futil.logger.debug('\n' + futil.shtm() + '- [ UPLOAD PATH ] | INFO ' + util.inspect(uploadPath));

            sampleFile.mv(uploadPath, async function(err) {
                if (err)
                  return res.status(500).send(err);
            
                    // res.send('File uploaded!');

                    req.body.path = uploadPath;
                    req.body.filename = sampleFile.name;
        
                    const task = await Task.update(req.body, {
                        where: {
                            id: req.params.id
                        }
                    });
                    
                    result.code = 200
                    result.status ="success"
                    result.data = "Update data success"
                    res.send(result);
              });

           
        }
        

    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Update data failed"
        res.send(result);
    }
}

var UpdateStatus = async function (){
    try{
        const task = await Task.findAll();
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(task));

        var current_date  = futil.currentDate()
        futil.logger.debug('\n' + futil.shtm() + '- [ CURRENT DATE ] | INFO ' + util.inspect(current_date));
        let date_1 = new Date(current_date);
       

        for (i=0;i<=task.length-1;i++){
           var task_date = task[i].task_date 
           let date_2 = new Date(task_date);
           var days = futil.dayDiffrence(date_1,date_2)
           futil.logger.debug('\n' + futil.shtm() + '- [ DAYS ] | INFO ' + util.inspect(days));
           var user_lat = task[i].user_lat
           var user_lon = task[i].user_lon
           var vehicle_lat = task[i].vehicle_lat
           var vehicle_lon = task[i].vehicle_lon
           var userid = task[i].userid
           var id = task[i].id

           if(!userid){
                futil.logger.debug('\n' + futil.shtm() + '- [ USERS NULL ] | INFO ');
           }else{
                if(days>0){
                    // check task status
                    var task_status = task[i].task_status
                    if (task_status != 'Overdue'){
                        if (!user_lat && !user_lon && !vehicle_lat && !vehicle_lon){
                            try{

                                var res_update = await Task.update({task_status: 'Overdue'},{
                                    where: {
                                        id: id
                                    }
                                });
                                
                                // await User.update({token:token},{
                                //     where: {
                                //         email:email
                                //     }
                                // });
                                

                                futil.logger.debug('\n' + futil.shtm() + '- [ RESP UPDATE] | INFO ' + util.inspect(res_update));
                            } catch (err){
                                futil.logger.debug('\n' + futil.shtm() + '- [ UPDATE ERROR ] | INFO ' + util.inspect(err));
                            }
                           
                        }else{
                            var res_update = await Task.update({task_status: 'Complete'},{
                                where: {
                                    id: id
                                }
                            });
                        }
                    }
                    // task status update to overdue
                }
           }
          
        }

    }catch (err){
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
    }
}

var Delete = async function (req,res){
    try {
        futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST PARAM ] | INFO ' + util.inspect(req.params));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST BODY ] | INFO ' + util.inspect(req.body));

        await Task.destroy({
            where: {
                id: req.params.id
            }
        });
        result.code = 200
        result.status ="success"
        result.data = "Delete data success"
        res.send(result);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Delete data failed"
        res.send(result);
    }
}

module.exports = {
    Create,
    Read,
    ReadTaskByStatus,
    ReadTotalStatusPerUser,
    ReadTaskUser,
    TaskFilter,
    Update,
    Delete
}
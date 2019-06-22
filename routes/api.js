/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB;
const moment = require('moment');
mongoose.connect(CONNECTION_STRING);

const schema = mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  }, 
  issue_text: {
    type: String,
    required: true
  }, 
  created_by: {
    type: Date,
    required: true
  },
  assigned_to: String,
  status_text: String,
  open: {
    type: Boolean,
    default: false
  },
  update_on: Date
},{
  versionKey: false
});

schema.pre('save', function(){
  this.update_on = moment().format("YYYY-MM-DD HH:mm:ss");
});

const Issue = mongoose.model('Issue', schema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res, next){
      var project = req.params.project;
      const issue = new Issue({
        ...req.body
      });
    
      issue.save(function(err, issue){
        if(err) return next(err);
        console.log(issue);
        res.json(issue);
      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};

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
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  assigned_to: String,
  status_text: String,
  open: {
    type: Boolean,
    default: true
  },
  c
  update_on: Date
},{
  versionKey: false
});

schema.pre('save', function(){
  this.update_on = moment().format("YYYY-MM-DD HH:mm:ss");
});

schema.methods.toJSON = function(){
  const obj = this.toObject();
  delete obj.project_name;
  return obj;
}

const Issue = mongoose.model('Issue', schema);
const props = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      const query = {
        project
      };
      for(const field of props.concat(['_id']))
        {
          if(req.query[field] && req.query[field] != '')
            query[field] = req.query[field];
        }
    
      Issue.find(query, function(err, issues){
        if(err) return res.send('mongodb error');
        res.json(issues);
      });
    })
    
    .post(function (req, res, next){
      var project = req.params.project;
      const issue = new Issue({
        ...req.body,
        project
      });
    
      issue.save(function(err, issue){
        if(err) res.send("can't create issue");
        else res.json(issue.toJSON());
      });
    
    })
    
    .put(function (req, res, next){
      var project = req.params.project;
      const _id = req.body._id;
      Issue.findOne({ _id, project }, function(err, issue){
        if(err) return res.send('mongodb error')
        if(!issue) return res.send('issue not found');
        if(!props.some((v) => req.body.hasOwnProperty(v)))
          return res.send('no updated field sent');
        
        const data = req.body;
        const requiredFields = ['issue_title', 'issue_text', 'created_by'];
        for(const field of requiredFields)
          {
            if(!data[field])
              delete data[field];
          }
        
        Object.assign(issue, data);
        issue.save(function(err, issue){
          if(err) return res.send('could not update ' + _id);
          res.send('successfully updated');
        });
      });
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      const _id = req.body._id;
      if(!_id) return res.send('_id error');
      Issue.findOneAndRemove({project, _id}, function(err, issue){
        if(err || !issue) return res.send('could not delete ' + _id);
        res.send('deleted ' + _id);
      });
    });
    
};

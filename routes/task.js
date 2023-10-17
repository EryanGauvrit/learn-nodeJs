var express = require('express');
var router = express.Router();

const mysql = require('../mysql');
const { paginateQuery } = require('../utils/sql');

/* GET home page. */

router.get('/', (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  try {
    const queryCount = `SELECT COUNT(id) as count FROM todo`;
    mysql(queryCount, count => {
      if(count){
        const totalCount = count[0].count;
        const query = `SELECT id, title, due_date, done, user from todo`;
        mysql(paginateQuery(query, totalCount, page, limit), response => {
          const responseFormat = {
            count: totalCount,
            hasPrev: page > 1,
            hasNext: limit + (page+1) < Math.max(count),
            response: response
          }
            if(response.length >= 1){
              res.json(responseFormat);
            }else{
              res.send("Il n'y a rien dans la bd");
            }
          
        })
      }
    })
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

router.get('/:id', (req, res, next) => {
  const taskId = req.params.id;
  try {
    const query = `SELECT * from todo WHERE id=${taskId}`;
    mysql(query, response => {
      if(response){
        const task = response.find((task) => task.id === Number(taskId));
        if(task){
          res.status(200);
          res.json(task);
        }else {
          res.status(404);
          res.send("L'identifiant ne correspond à aucun élément.");
        }
      }else{
        res.status(404);
        res.send("L'identifiant ne correspond à aucun élément.");
      }
    })
  } catch(err) {
    res.status(500);
    res.send(err);
  }
});

router.post('/', (req, res, next) => {

  const done = req.body.done ? 1 : 0;

  try {
    const query = `Insert into todo (title, creation_date, due_date, done, description, user) Values ('${req.body.title}', '${req.body.creation_date}', '${req.body.due_date}', '${done}', '${req.body.description}', '${req.body.user}')`;
    mysql(query, response => {
      if(response){
        res.status(201)
        res.send("Tâche ajoutée !")
      }else{
        res.send("Une erreur est survenue.");
      }
    })
  } catch(err) {
    res.status(500);
    res.send(err);
  }
});

router.patch('/:id', (req, res, next) => {
  const taskId = req.params.id;
  const done = req.body.done ? 1 : 0;

  try {
    const query = `Update todo set title='${req.body.title}', creation_date='${req.body.creation_date}', due_date='${req.body.due_date}', done='${done}', description='${req.body.description}', user='${req.body.user}' where id=${taskId}`;
    mysql(query, response => {
      if(response){
        res.status(200)
        res.send("Tâche modifiée !")
      }else{
        res.send("Une erreur est survenue.");
      }
    })
  } catch(err) {
    res.status(500)
    res.send(err);
  }

});

router.delete('/:id', (req, res, next) => {
  const taskId = req.params.id;
  try {
    const query = `SELECT * from todo WHERE id=${taskId}`;
    mysql(query, response => {
      if(response){
        const task = response.find((task) => task.id === Number(taskId));
        if(task){
          try {
            const query = `Delete from todo where id=${taskId}`;
            mysql(query, response => {
              if(response){
                res.send("La tâche a bien été supprimée !");
              }else{
                res.send("L'identifiant ne correspond à aucun élément.");
              }
            })
          } catch(err) {
            console.error(err);
          }
        }else {
          res.send("L'identifiant ne correspond à aucun élément.");
        }
      }else{
        res.send("Il n'y a rien dans la bd");
      }
    })
  } catch(err) {
    res.status(500);
    res.send(err)
  }
});

module.exports = router;

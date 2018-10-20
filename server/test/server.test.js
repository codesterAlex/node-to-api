
const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text: 'First test todo'
},{
  _id: new ObjectId(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(()=> done());
});


describe('POST/todos',() => {
  it('Should create a new todo',(done) => {
  var text = 'Test it now';

  request(app)
  .post('/todos')
  .send({text})
  .expect(200)
  .expect((res)=>{
    expect(res.body.text).toBe(text);
  })
  .end((err, res)=>{
    if(err){
      return done(err);
    }

    Todo.find({text}).then((todos)=>{
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe(text);
      done();
    }).catch((e)=>done(e));
  })
});

it('Should not create todo with invalid body data',(done)=>{

  request(app)
  .post('/todos')
  .send({})
  .expect(400)
  .end((err, res)=>{
    if(err){
      return done(err);
    }

    Todo.find().then((todos)=>{
      expect(todos.length).toBe(2);
      done();
    }).catch((e)=> done(e));
  });
});

});
// describe('GET/Todos',() => {
//   it('Should get all the todos', (done)=>{
//     request(app)
//       .get('/todos')
//       .expect(200)
//       .expect((res) => {
//           expect(res.body.length).toBe(2);
//   })
//   .end(done)
// });
// });

describe('GET/todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo['text']).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should return 404 if todo not found',(done) =>{
    request(app)
    .get(`/todos/${new ObjectId().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return  404 for non-object ids', (done) =>{
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done)
  });
  });





  describe('DELETE/todos/:id',()=>{


    it('Should delete the data',(done)=>{
      var hexId =  todos[1]._id.toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.removedTodo._id).toBe(hexId);
      })
      .end((err, res) =>{
        if(err)
        {
          return done(err);
        }
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=> done(e))
      })
    })

    it('Should return 404 if todo is not found',(done) => {
      var hexId = new ObjectId().toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
    });

    it('Should return 404 if object id is valid', (done) =>{
      request(app)
      .delete('/todos/567abcd')
      .expect(404)
      .end(done);
    });
  });

  describe('PATCH/Todos/:id',()=>{
    it('Should update the todo', (done)=>{
      var hexId =  todos[0]._id;

      request(app)
      .patch(`/todos/${hexId}`)
      .send({
        "text":"something more coller",
        "completed":true
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe('something more coller');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('string');
      })
      .end(done)
    });

    it('Should clear completedAt when todo is not completed', (done)=>{
    var hexId = todos[1]._id;

    request(app)
    .patch(`/todos/${hexId}`)
    .send(
      {
        "text":"Something more coller",
        "completed":false})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe('Something more coller');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done)
    })
  })

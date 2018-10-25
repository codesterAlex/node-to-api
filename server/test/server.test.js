const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

console.log(process.env.JWT_SECRET);
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST/todos',() => {
  it('Should create a new todo',(done) => {
  var text = 'Test it now';

  request(app)
  .post('/todos')
  .set('x-auth', users[0].tokens[0].token)
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
  .set('x-auth', users[0].tokens[0].token)
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
describe('GET/Todos',() => {
  it('Should get all the todos', (done)=>{
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body.todos.length).toBe(1);
  })
  .end(done)
});
});

describe('GET/todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo['text']).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should not return todo doc created by another', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });



  it('Should return 404 if todo not found',(done) =>{
    request(app)
    .get(`/todos/${new ObjectId().toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return  404 for non-object ids', (done) =>{
    request(app)
    .get(`/todos/123`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });
  });





  describe('DELETE/todos/:id',()=>{


    it('Should delete the data',(done)=>{
      var hexId =  todos[1]._id.toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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
          expect(todo).toBeFalsy();
          done();
        }).catch((e)=> done(e))
      })
    });

    it('Should delete the data',(done)=>{
      var hexId =  todos[0]._id.toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) =>{
        if(err)
        {
          return done(err);
        }
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toBeTruthy();
          done();
        }).catch((e)=> done(e))
      })
    });


    it('Should return 404 if todo is not found',(done) => {
      var hexId = new ObjectId().toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
    });

    it('Should return 404 if object id is valid', (done) =>{
      request(app)
      .delete('/todos/567abcd')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
    });
  });

  describe('PATCH/Todos/:id',()=>{
    it('Should update the todo', (done)=>{
      var hexId =  todos[0]._id;

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        "text":"something more coller",
        "completed":true
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe('something more coller');
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('string');
      })
      .end(done)
    });

    it('Should not update the todo of another user', (done)=>{
      var hexId =  todos[0]._id;

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        "text":"something more coller",
        "completed":true
      })
      .expect(404)
      .end(done)
    });


    it('Should clear completedAt when todo is not completed', (done)=>{
    var hexId = todos[1]._id;
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send(
      {
        "text":"Something more coller",
        "completed":false})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe('Something more coller');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done)
    })
  })


describe('GET /user/me', ()=>{
  it('Should return user if authenticate', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('Should return 401 if not authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  })

});

describe('POST /users', () => {
  it('should create a user',(done) =>{
    var email =  'example@gmail.com';
    var password = 'egpass';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email)
    })
    .end((err) => {
      if(err)
      {
        return done(err);
      }

      Users.findOne({email}).then((user) =>{
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch((e) => done(e));
    })
  })

  it('Should return validation errors if request invalid', (done) =>{
    var email = 'something';
    var password = '';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) =>{
    var email = 'lalitsunar@gmail.com';
    var password = 'something';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () =>{
  it('Should login user and return auth token', (done) =>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err, res) =>{
      if(err)
      {
        return done(err);
      }

      Users.findById(users[1]._id).then((user) =>{
        expect(user.toObject().tokens[0]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });
it('Should reject invalid login', (done) =>{
  request(app)
  .post('/users/login')
  .send({
    email: users[1].email,
    password: '123445567'
  })
  .expect(400)
  .expect((res) => {
    expect(res.headers['x-auth']).toBeFalsy();
  })
  .end((err, res) =>{
    if(err)
    {
      return done(err);
    }

    Users.findById(users[1]._id).then((user) =>{
      expect(user.tokens.length).toBe(1);
      done();
    }).catch((e) => done(e));
  });
})
});


describe('DELETE /users/me/token',() =>{
  it('Should remove auth token on logout', (done) =>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) =>{
        if(err)
        {
          return done(err);
        }
        Users.findById(users[0]._id).then((user) =>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) =>done(e));
      })
  })
})

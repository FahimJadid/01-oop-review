// Let's suppose we're building a quiz game with users

/*
Some of the users
Name : Phil
Score : 4

Name: Julia
Score : 5

Functionality: 
+ Ability to increase score
*/

/* What would be the best way to store this data and
functionality?
*/

// Answer: Objects - store functions with their associated data!

const user1 = {
  name: 'Phil',
  score: 4,
  increment: function () {
    user1.score++;
  },
};

user1.increment();

// This is the Principle of Encapsulation

/*
Note we would in reality have a lot of different relevant
functionality for our user objects
— Ability to increase score
— Ability to decrease score
— Delete user
— Log in user
— Log out user
— Add avatar
— get user score
— … (100s more applicable functions)
*/

/*
What alternative
techniques do we have for
creating objects?
*/

// Creating user2 using 'dot notation'

const user2 = {}; // Create an empty object
user2.name = 'Julia'; // Assign properties to that object
user2.score = 5;
user2.increment = function () {
  user2.score++;
};

// Creating user3 using 'Object.create'

const user3 = Object.create(null);
user3.name = 'Eva';
user3.score = 9;
user3.increment = function () {
  user3.score++;
};

/*
Our code is getting repetitive, we're breaking our DRY principle
And suppose we have millions of users!
What could we do?
*/

// Solution 1. Generate objects using a function

function userCreator(name, score) {
  const newUser = {};
  newUser.name = name;
  newUser.score = score;
  newUser.increment = function () {
    newUser.score++;
  };
  return newUser;
}

const user1 = userCreator('Phil', 4);
const user2 = userCreator('Julia', 5);
user1.increment();

/* 
Above code is not DRY, We are creating identical
functions on every single objects
*/

/*
Problems:
Each time we create a new user we make space in our
computer's memory for all our data and functions. But
our functions are just copies
Is there a better way?
Benefits:
It's simple and easy to reason about!
*/

/*
Solution 2:
Store the increment function in just one object and
have the interpreter, if it doesn't find the function on
user1, look up to that object to check if it's there
How to make this link?
*/

// Using the Prototype Chain

const functionScore = {
  increment: function () {
    this.score++;
  },
  login: function () {
    console.log('You are logged in');
  },
};

const user1 = {
  name: 'Phil',
  score: 4,
};

user1.name; // name is a property of user1 object
user1.increment; // Error! increment is not!

/*
Link user1 and functionStore so the interpreter, on not finding .increment,
makes sure to check up in functionStore where it would find it
*/

// Make the link with Object.create() technique

const user1 = Object.create(functionScore);
user1; // {}

user1.increment; // function..

/*
Interpreter doesn't find .increment on user1 and
looks up the prototype chain to the next object and
finds .increment 1 level up
*/

// Solution 2 in full

function userCreator(name, score) {
  const newUser = Object.create(userFunctionStore);
  newUser.name = name;
  newUser.score = score;
  return newUser;
}

const userFunctionStore = {
  increment: function () {
    this.score++;
  },
  login: function () {
    console.log('You are logged!');
  },
};

const user1 = userCreator('Phil', 4);
const user2 = userCreator('Julia', 5);
user1.increment();

/*
Problem:
No problems! It's beautiful
Maybe a little long-winded
const newUser = Object.create(functionStore);
...
return newUser
Write this every single time - but it's 6 words!
Super sophisticated but not standard
*/

// Solution 3 - Introducing the keyword that automates the hard work: new

const user1 = new userCreator('Phil', 4);

/*
When we call the constructor function with new in front we automate 2 things
1. Create a new user object
2. return the new user object

But now we need to adjust how we write the body of userCreator - how can we:
— Refer to the auto-created object?
— Know where to put our single copies of functions?
*/
// The new keyword automates a lot of our manual work

function userCreator(name, score) {
  this.name = name;
  this.score = score;
}

userCreator.prototype; // {}
userCreator.prototype.increment = function () {
  this.score++;
};

let user1 = new userCreator('Phil', 4);

// Interlude - functions are both objects and functions :

function multiplyBy2(num) {
  return num * 2;
}
multiplyBy2.stored = 5;
multiplyBy2(3); // 6
multiplyBy2.stored; // 5
multiplyBy2.prototype; // {}

/*
We could use the fact that all functions have a default property
on their object version, ’prototype’, which is itself an object - to
replace our functionStore object
*/

// Complete solution 3

function userCreator(name, score) {
  this.name = name;
  this.score = score;
}

userCreator.prototype.increment = function () {
  this.score++;
};

userCreator.prototype.login = function () {
  console.log('Logged in');
};

const user1 = new userCreator('Eva', 9);
user1.increment();

/* 
// Benefits:
— Faster to write
— Still typical practice in professional code
— 99% of developers have no idea how it works and
  therefore fail interviews
— We have to upper case first letter of the function so
  we know it requires ‘new’ to work!
*/

/*
What if we want to organize our code inside one of our
shared functions - perhaps by defining a new inner
function
*/

function userCreator(name, score) {
  this.name = name;
  this.score = score;
}

UserCreator.prototype.increment = function () {
  function add1() {
    this.score++;
  }
  add1();
};

UserCreator.prototype.login = function () {
  console.log('Login');
};

const user1 = new userCreator('Eva', 9);

user1.increment();

// We need to introduce arrow functions - which bind this lexically/statistically

function UserCreator(name, score) {
  this.name = name;
  this.score = score;
}

UserCreator.prototype.increment = function () {
  const add1 = () => {
    this.score++;
  };
  add1();
};

UserCreator.prototype.login = function () {
  console.log('Login');
};

const user1 = new UserCreator('Eva', 9);
user1.increment();

/*
# Solution 4
We’re writing our shared methods separately from our
object ‘constructor’ itself (off in the User.prototype object)
Other languages let us do this all in one place. ES2015
lets us do so too

*/

// The class 'Syntactic Sugar

class UserCreator {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
  increment() {
    this.score++;
  }
  login() {
    console.log('Login');
  }
}

const user1 = new UserCreator('Eva', 9);

user1.increment();

/*
Benefits:
— Emerging as a new standard
— Feels more like style of other languages (e.g. Python)
Problems
— 99% of developers have no idea how it works and
therefore fail interviews
*/

/*
JavaScript uses this proto link to give objects, functions
and arrays a bunch of bonus functionality. All objects by
default have __proto__
*/
const obj = {
  num: 3,
};
obj.num; // 3
obj.hasOwnProperty('num'); // ? Where's this method?

Object.prototype; // {hasOwnProperty: FUNCTION}
/*
  — With Object.create we override the default __proto__ reference to
Object.prototype and replace with functionStore
— But functionStore is an object so it has a __proto__ reference to
Object.prototype - we just intercede in the chain
*/

/*
Arrays and functions are also objects so they get access to
all the functions in Object.prototype but also more
goodies
*/

function multiplyBy2(num) {
  return num * 2;
}
multiplyBy2.toString(); //Where is this method?
Function.prototype; // {toString : FUNCTION, call : FUNCTION, bind : FUNCTION}
multiplyBy2.hasOwnProperty('score'); // Where's this function?
Function.prototype.__proto__; // Object.prototype {hasOwnProperty: FUNCTION}

// Subclassing

// Subclassing in solution 2

function userCreator(name, score) {
  const newUser = Object.create(userFunctions);
  newUser.name = name;
  newUser.score = score;
  return newUser;
}
userFunctions = {
  sayName: function () {
    console.log('I am ' + this.name);
  },
  increment: function () {
    this.score++;
  },
};

const user1 = userCreator('Phil', 5);
user1.sayName();

function paidUserCreator(paidName, paidScore, accountBalance) {
  const newPaidUser = userCreator(paidName, paidScore);
  Object.setPrototypeOf(newUserpaid, paidUserFunctions);
  newPaidUser.accountBalance = accountBalance;
  return newPaidUser;
}

const paidUserFunctions = {
  increaseBalance: function () {
    this.accountBalance++;
  },
};

Object.setPrototypeOf(paidUserFunctions, userFunctions);
const paidUser1 = paidUserCreator('Alyssa', 8, 25);

paidUser1, increaseBalance();
paidUser1.sayName();

// Interlude - We have another way of running a function that
// allow us to control the assignment of this

const obj = {
  num: 3,
  increment: function () {
    this.num++;
  },
};
const otherObj = {
  num: 10,
};
obj.increment(); // obj.num now 4
obj.increment.call(otherObj); // otherObj.num now 11
// obj.increment.apply(otherObj);

/*
this always refers to the object to the left of the dot on which the function (method) is
being called - unless we override that by running the function using .call()
or .apply() which lets us set the value of this inside of the increment function
*/

// Subclassing in solution 3
// Constructor (Pseudoclassical) approach

function userCreator(name, score) {
  this.name = name;
  this.score = score;
}
userCreator.prototype.sayName = function () {
  console.log('I am ' + this.name);
};

userCreator.prototype.increment = function () {
  this.score++;
};

const user1 = new userCreator('Phil', 5);
const user2 = new userCreator('Tim', 4);
user1.sayName();

function paidUserCreator(paidName, paidScore, accountBalance) {
  userCreator.call(this, paidName, paidScore);
  // userCreator.apply(this, [paidName, paidScore]);
  this.accountBalance = accountBalance;
}

paidUserCreator.prototype = Object.create(userCreator.prototype);

(paidUserCreator.prototype.increaseBalance = function () {
  this.accountBalance++;
}),
  
const paidUser1 = new paidUserCreator('Alyssa', 8, 25);

paidUser1, increaseBalance();
paidUser1.sayName();

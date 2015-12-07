var FalcorServer = require('falcor-express'),
bodyParser = require('body-parser'),
express = require('express'),
Router = require('falcor-router'),
jsonGraph = require('falcor-json-graph'),
$ref = jsonGraph.ref,
path = require('path'),
_ = require('lodash'),
app = express(),
data = {

  interests: [
    {
      id: 0,
      name: "Sci Fi",
      users: [2, 3] },
    {
      id: 1,
      name: "Falcor",
      users: [2, 3] },
    {
      id: 2,
      name: "Stuff",
      users: [0, 1]
    }
  ],

  users: [
    {
      id: 0,
      name: "Han Solo",
      friends: [],
      interests: [2] },
    {
      id: 1,
      name: "Chewbacca",
      friends: [0],
      interests: [2] },
    {
      id: 2,
      name: "R2D2",
      friends: [3],
      interests: [0, 1] },
    {
      id: 3,
      name: "Luke Skywalker",
      friends: [0, 2],
      interests: [0, 1]
    }
  ]

},
NamesRouter = Router.createClass([
  {
    route: 'interests.length',
    get: () => {
      return {path: ['interests', 'length'], value: data.interests.length}
    }
  },
  {
    route: 'interests[{integers:interestIndex}]',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.interestIndex.forEach(index => {
        var interest = data.interests[index];

        if (interest == null) {
          pathValues.push({ path: ["interests", index], value: interest });
        }
        else {
          pathValues.push( {
            path: ["interests", index],
            value: $ref( ["interestsById", interest.id])
          })
        }
      })
      return pathValues
    }
  },
  {
    route: 'interestsById[{integers:interestIds}].name',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.interestIds.forEach(id => {
        var interest = _.find(data.interests, { "id": id });

        pathValues.push({
          path: ['interestsById', id, 'name'],
          value: interest.name
        })
      })
      return pathValues
    }
  },
  {
    route: 'interestsById[{integers:interestIds}].users[{integers:userIndices}]',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.interestIds.forEach(interestId => {
        var interest = _.find(data.interests, { "id": interestId });

        pathSet.userIndices.forEach(userIndex => {
          var userId = interest.users[userIndex];

          if ( userId == null || !_.includes(interest.users, userId) ) {
            pathValues.push({ path: ["interestsById", interestId, "users", userIndex], value: null });
          }
          else {
            pathValues.push( {
              path: ["interestsById", interestId, "users", userIndex],
              value: $ref( ["usersById", userId])
            })
          }
        })
      })
      return pathValues
    }
  },



  {
    route: 'users.length',
    get: () => {
      return {path: ['users', 'length'], value: data.users.length}
    }
  },
  {
    route: 'users[{integers:userIndices}]',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.userIndices.forEach(index => {
        var user = data.users[index];

        if (user == null) {
          pathValues.push({ path: ["users", index], value: user });
        }
        else {
          pathValues.push( {
            path: ["users", index],
            value: $ref( ["usersById", user.id])
          })
        }
      })
      return pathValues
    }
  },
  {
    route: 'usersById[{integers:userIds}].name',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.userIds.forEach(id => {
        var user = _.find(data.users, { "id": id });

        pathValues.push({
          path: ['usersById', id, 'name'],
          value: user.name
        })
      })
      return pathValues
    }
  },
  {
    route: 'usersById[{integers:userIds}].friends[{integers:friendIndices}]',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.userIds.forEach(userId => {
        var user = _.find(data.users, { "id": userId });

        pathSet.friendIndices.forEach(friendIndex => {
          var friendId = user.friends[friendIndex];

          if (friendId == null || !_.includes(user.friends, friendId)) {
            pathValues.push({ path: ["usersById", userId, "friends", friendIndex], value: null });
          }
          else {
            pathValues.push( {
              path: ["usersById", userId, "friends", friendIndex],
              value: $ref( ["usersById", friendId])
            })
          }
        })
      })
      return pathValues
    }
  },
  {
    route: 'usersById[{integers:userIds}].interests[{integers:interestIndices}]',
    get: (pathSet) => {
      var pathValues = [];
      pathSet.userIds.forEach(userId => {
        var user = _.find(data.users, { "id": userId });

        pathSet.interestIndices.forEach(interestIndex => {
          var interestId = user.interests[interestIndex];

          if (interestId == null || !_.includes(user.interests, interestId)) {
            pathValues.push({ path: ["usersById", userId, "interests", interestIndex], value: null });
          }
          else {
            pathValues.push( {
              path: ["usersById", userId, "interests", interestIndex],
              value: $ref( ["interestsById", interestId])
            })
          }
        })
      })
      return pathValues
    }
  },












  // {
  //   route: 'users[{integers:userIndices}]["name"]',
  //   get: (pathSet) => {
  //     var pathValues = [];
  //     pathSet.userIndices.forEach(index => {
  //       if (data.users.length > index) {
  //         pathValues.push({
  //           path: ['users', index, 'name'],
  //           value: data.users[index].name
  //         })
  //       }
  //     })
  //     return pathValues
  //   }
  // },
  {
    route: 'users.add',
    call: (callPath, args) => {
      var newName = args[0];

      data.users.push({name: newName})

      return [
        {
          path: ['users', data.users.length-1, 'name'],
          value: newName
        },
        {
          path: ['users', 'length'],
          value: data.users.length
        }
      ]
    }
  }
])

app.use(bodyParser.urlencoded({extended: false}));
app.use('/model.json', FalcorServer.dataSourceRoute(() => new NamesRouter()))

app.get('/', function (req, res) {
  res.render('query');
})

app.use(express.static(path.join(__dirname, '../../site')))

app.set('views', 'src/server/views');
app.set('view engine', 'jade');

app.listen(3030, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('navigate to http://localhost:3030')
});


// test
// var router = new NamesRouter();
// router.get([["users",[3],"interests",[0],"name"]]).subscribe(function(jsonGraph) {
//   console.log(JSON.stringify(jsonGraph, null, 4));
// })

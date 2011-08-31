define [
  'data/mock/users/allUsers'
  'data/mock/PathHelper'
], (users,{getPathComponents})->
  (path)->
    [api,users,userid,schedule,date] = getPathComponents path
    users[userid].shows
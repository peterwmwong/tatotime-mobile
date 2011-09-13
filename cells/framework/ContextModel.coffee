define ['./Model'], (Model)->
  class ContextModel extends Model
    constructor: ({id,initialHash,hashManager,defaultPagePath})->
      super
        id: id
        defaultPagePath: defaultPagePath
        currentPageModel: currentPageModel = new Model initialHash
        pageHistory: pageHistory = [currentPageModel]

      (bind = {})["change:current[context=#{id}]"] = ({cur})=>
        if pageHistory[1]?.hash is cur.hash
          pageHistory.splice 0, 1
        else
          pageHistory.unshift new Model cur
        @set currentPageModel: pageHistory[0]
      hashManager.bind bind
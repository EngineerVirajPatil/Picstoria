const searchHistories = require("../models/searchHistory");

const searchHistoryByUserId=async(userId)=>{
  const history=await searchHistories.findAll({where:{userId}});

  if(history.length===0){
   throw new Error("No search History found for user ID: "+userId);
  }

  const historyElements=[];

  for(element of history){
     const specificElement={
        query: element.query,
        timestamp:element.timestamp,
     }
     historyElements.push(specificElement);
  }

  return {searchHistory:historyElements};

}

module.exports=searchHistoryByUserId;
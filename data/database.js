const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;
async function connection(){
 const client =  await MongoClient.connect("mongodb://127.0.0.1:27017");
 database = client.db('BlogDB')

}

function getdb (){
    if(!database){
        throw{message: 'Database not established'}
    }
    return database;
}

module.exports = {
    connection: connection,
    getdb: getdb
}

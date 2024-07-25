.env
MONGO_INITDB_ROOT_USERNAME=yourusername
MONGO_INITDB_ROOT_PASSWORD=yourpassword


docker-compose up -d --build


docker exec -it mongo1 mongosh -u your_mongo_root_username -p your_mongo_root_password --authenticationDatabase admin --eval 'rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})'


docker exec -it mongo1 mongosh -u your_mongo_root_username -p your_mongo_root_password --authenticationDatabase admin --eval 'rs.status()'

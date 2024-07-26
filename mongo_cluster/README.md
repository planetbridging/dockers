docker-compose up -d --build


docker exec -it mongo1 mongosh -u <USERNAME> -p <PASSWORD> --authenticationDatabase admin


rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})


set for external access

rs.reconfig({
  _id: "rs0",
  members: [
    { _id: 0, host: "<DOMAIN>:27017" },
    { _id: 1, host: "<DOMAIN>:27018" },
    { _id: 2, host: "<DOMAIN>:27019" }
  ]
}, { force: true })


create admin user

use admin
db.createUser({
  user: "<USERNAME>",
  pwd: "<PASSWORD>",
  roles: [ { role: "root", db: "admin" } ]
})

check status

docker exec -it mongo1 mongosh -u <USERNAME> -p <PASSWORD> --authenticationDatabase admin --eval 'rs.status()'


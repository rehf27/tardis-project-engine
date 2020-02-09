db.createUser(
  {
    user: "tardis",
    pwd: "gamer",
    roles: [
      {
        role: "readWrite",
        db: "games"
      }
    ]
  }
);

import db from "./index.js";

const User = {};

//Check if a user with certain email
User.emailExists = (email) => {
  try {
    return db.oneOrNone("SELECT * FROM public.user WHERE email=$1", email);
  } catch (err) {
    console.log(err);
  }
};

//Check if a user with a certain name exists
User.nameExists = (name) => {
  try {
    return db.oneOrNone("SELECT * FROM public.user WHERE name=$1", name);
  } catch (err) {
    console.log(err);
  }
};

//Create user based on given data
User.create = (userInfo) => {
  const { name, email, password } = { ...userInfo };
  try {
    return db.query(
      "INSERT INTO public.user (name, email, password, created_at, is_active, last_activity) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;",
      [name, email, password, new Date(), false, new Date()]
    );
  } catch (err) {
    console.log(err);
  }
};

//Retrieve all users
User.getAll = () => {
  try {
    return db.any(
      "SELECT id, name, email, created_at, is_active, last_activity FROM public.user"
    );
  } catch (err) {
    console.log(err);
  }
};

//Retrieve user identified by email
User.getByEmail = (email) => {
  try {
    return db.oneOrNone(
      "SELECT id, name, email, created_at, is_active, last_activity FROM public.user WHERE email=$1",
      email
    );
  } catch (err) {
    console.log(err);
  }
};

//Retrieve user identified by id
User.getById = (id) => {
  try {
    return db.oneOrNone(
      "SELECT id, name, email, created_at, is_active, last_activity FROM public.user WHERE id=$1",
      id
    );
  } catch (err) {
    console.log(err);
  }
};

//Retrieve users password hash, identified by email
User.getPasswordHash = (email) => {
  try {
    return db.oneOrNone(
      "SELECT password FROM public.user WHERE email=$1",
      email
    );
  } catch (err) {
    console.log(err);
  }
};

User.getRoles = (userId) => {
  try {
    return db.any("SELECT role.name FROM PUBLIC.role INNER JOIN user_role ON user_role.role_id = role.id WHERE user_id=$1", userId);
  } catch (err) {
    console.log(err);
  }
}

User.addRole = (userId, roleId) => {
  try{
    return db.any("INSERT INTO user_role (user_id, role_id) VALUES ($1, $2);", [userId, roleId]);
  }catch(err){
    console.log(err);
  }
}

User.removeRole = (userId, roleId) => {
  try{
    return db.any("DELETE FROM user_role WHERE user_id=$1 AND role_id=$2;", [userId, roleId]);
  }catch(err){
    console.log(err);
  }
}

User.confirmEmail = (userId) => {
  try{
    return db.query("UPDATE public.user SET is_active=$1 WHERE id=$2;",[true,userId]);
  }catch(err){
    console.log(err);
  }
}

User.deleteById = (userId) => {
  try{
    return db.query("UPDATE public.user SET name=$1, email=$2, password=$3, created_at=$4, is_active=$5, last_activity=$6, is_banned=$7, ban_ends_at=$8 WHERE id=$9;",['','','',null,false,null,false,null,userId]);
  }catch(err) {
    console.log(err);
  }
}

export default User;

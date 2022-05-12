import db from "../models/index.js";

export const dropData = () => {
   return db.query(dropUsersAndQuotes);
};

export const dropComments = () => {
   return db.query("DELETE FROM comment;");
};

export const dropQuotes = () => {
   return db.query("DELETE FROM quote;");
};

export const dropUsers = () => {
   return db.query("DELETE FROM public.user;");
};

export const dropCommentLikes = () => {
   return db.query("DELETE FROM comment_like;");
}

export const dropUserRoles = () => {
   return db.query("DELETE FROM user_role;");
}

export const dropRoles = () => {
   return db.query("DELETE FROM public.role;");
}

export const addTestUserWithUserId = (user_id) => {
   return db.query("INSERT INTO public.user(id,name,email,password,created_at,is_active) VALUES($1,'Test User $1','test$1@mail.com','passw0rd',LOCALTIMESTAMP,true);",user_id);
}

export const addTestQuoteWithUserId = (quote_id, user_id) => {
   return db.query("INSERT INTO quote(id,quotetext,said_by,user_id) VALUES($1,'Test Quote','Test Sayer',$2);",[quote_id,user_id]);
};

export const addTestQuoteWithCertainText = (quote_id, user_id, quotetext) => {
   return db.query("INSERT INTO quote(id,quotetext,said_by,user_id) VALUES($1, $3,'Test Sayer',$2);",[quote_id,user_id,quotetext]);
}

export const addTestCommentToTestQuoteWithUserId = (id, quote_id, user_id) => {
   return db.query("INSERT INTO comment(id,commenttext,posted,user_id,quote_id) VALUES($1, 'Test comment $1',LOCALTIMESTAMP,$2,$3);",[id, user_id, quote_id]);
};

export const addRole = (id, rolename) => {
   return db.query("INSERT INTO public.role(id,name) VALUES($1,$2);",[id, rolename]);
}

export const giveUserRole = (user_id, role_id) => {
   return db.query("INSERT INTO user_role(user_id, role_id) VALUES($1,$2);",[user_id, role_id]);
}

export const getUserById = (id) => {
   return db.oneOrNone("SELECT * FROM public.user WHERE id=$1;",id);
};

const dropUsersAndQuotes = `
DELETE FROM quote;
DELETE FROM public.user;
`;


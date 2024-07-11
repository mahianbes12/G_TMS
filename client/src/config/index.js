export const environment = process.env.NODE_ENV || "development";
export const backendUrl = 
//"mysql://root:12345678@localhost:3306/gize";
  process.env.NODE_ENV === "production"
    ? `https://methodic-backend.herokuapp.com/`
    : "http://localhost:8080/";

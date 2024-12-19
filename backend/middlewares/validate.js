const {todoSchema} = require("../validator/todoValidator");

//mdiddleware to perform validation before affecting db
const validate = (req,res,next) =>{
    const {error}  = todoSchema.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(400).json({ error:error.details[0].message });
    }
    console.log("valid input json in the request body")
    next();
};

module.exports = {validate}



/*
const testJSON = {
  taskName: "Learn Sequelize",
  createdAt: "2024-12-19T12:00:00.000Z",
  dueAt: "2024-12-25T12:00:00.000Z",
  importance: "highd",
  status: "in-progress"
};

const validateJSON = (data) => {
  const { error } = todoSchema.validate(data, { abortEarly: false }); // Validate the data
  if (error) {
    console.error("Validation error:", error.details[0].message);
  } else {
    console.log("Valid json");
  }
};

validateJSON(testJSON);

*/

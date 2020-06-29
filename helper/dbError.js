
//Refrenced from docs of mongoose and blos of medium 

const uniqueMessage = error => {
    let output;
    try {
      //  console.log(error.message.lastIndexOf(".$") + 2)
        let fieldName = error.message.substring(
            error.message.lastIndexOf(".$") + 2,
            error.message.lastIndexOf("_1")
        );
        //  console.log( fieldName.split(":")[2].charAt(0))
            output =
            fieldName.split(":")[2]+
                " already exists";
    } catch (ex) {
        output = "Unique field already exists";
    }
 
    return output;
};
 

exports. errorHandler = (error) => {
    let message = "";
 
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }
 
    return message;
};


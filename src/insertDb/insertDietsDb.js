const {Diet} =require("../db"); 

const diets = [
    {"name":"Gluten Free"},
    {"name":"Dairy Free"},
    {"name":"Lacto ovo vegetarian"},
    {"name":"Vegan"},
    {"name":"Paleolithic"},
    {"name":"Primal"},
    {"name":"Whole 30"},
    {"name":"Pescatarian"},
    {"name":"Ketogenic"},
    {"name": "Fodmap friendly"},
];
const inertDietsDb = async()=>{
    try{
        const allDiets =await Diet.findAll();
        if(allDiets.length === 0) {
            await Diet.bulkCreate(diets);
        }
    }catch(err){
        return err;
    }
}

module.exports ={
    inertDietsDb,
}
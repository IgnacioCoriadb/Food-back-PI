const axios = require('axios');
const {Recipe,Diet}  = require('../db');
const {API_KEY} = process.env;
const { Op } = require("sequelize");


//?--------------------GET/RECIPES ALL API -------------------------------------------
const getAllRecipesApi = async() =>{
    try{
        const recipesApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`);
        const dataApi = recipesApi.data.results.map((r)=>{
            return {
                id: r.id,
                image: r.image,
                name: r.title,
                diets: r.diets,
                healthScore: r.healthScore
            }
        });
        return dataApi;
    }catch(err){
        return null;
    }
}
//?----------------------GET/RECIPES ALL DB------------------------------------------
const getAllRecipesDB = async() =>{
    try{
        const recipesDb = await Recipe.findAll(
            {
                include:{
                    model: Diet,
                    attributes: ['name'],
                    through: {
                        attributes: [],
                    }
                }    
            
            }
            );
           
            return recipesDb.length === 0 ? null : recipesDb ;
    }catch(err){
        return null;
    }
}
//?------------------------CONCAT ALLAPI-ALLDB--------------------------------------
const allRecipes_DB_API = async()=>{
    try{
        const api =await getAllRecipesApi();
        const db = await getAllRecipesDB();
        if(api === null && db !== null) return db;
        if(db === null && api !== null) return api;
        if(api !== null && db !== null) return api.concat(db);
        if(api === null && db === null)  throw new Error("Recetas no encontradas");
    }catch(err){
        return err.message;
    }  
}
//?--------------------GET/RECIPES?NAME="..."------------------------------------ 
const getRecipesQuery = async(name)=>{
    try{
        const allRecipes =await allRecipes_DB_API();

        let recipeByName= await allRecipes.filter(r=> r.name.toLowerCase().includes(name.toString().toLowerCase()));

        if(recipeByName.length){
            let recipes = recipeByName.map(r=>{
                return{
                    id: r.id,
                    image: r.image,
                    name: r.name,
                    diets: r.diets
                }
            })
            return recipes;
        }else{
            throw new Error("No se encontró la receta con el nombre " + name);
        }
    }catch(err){
         return  err.message;;
    }
}

//?--------------------GET/RECIPES/{idReceta} API------------------------------------
const getRecipesIdApi =async(idRecipes)=>{
    try{
        const recipesApi = await axios.get(`https://api.spoonacular.com/recipes/${idRecipes}/information?apiKey=${API_KEY}&addRecipeInformation=true`);

        const r =recipesApi.data;
        const dataApi = [{
            id: r.id,
            image: r.image,
            name: r.title,
            diets: r.diets,
            summary: r.summary,
            healthScore: r.healthScore,
            dishTypes: r.dishTypes,
            steps: r.analyzedInstructions[0]?.steps.map(e => {
                return {
                    number: e.number,
                    step: e.step
                }
            })
            
        }]

        return dataApi.length > 0 ? dataApi : [];
    }catch(err){
        return err.message;
    }
}
//?--------------------GET/RECIPES/{idReceta} BD-------------------------------------
const getRecipesIdBD = async(idRecipes)=>{
    try{
        const recipesDb = [await Recipe.findByPk(idRecipes,{include: Diet})];

     return recipesDb.length > 0 ? recipesDb : []
    }catch(err){
        return err;
    }
}
//?--------------------CONCAT IDAPI-IDBD---------------------------------------------
const idRecipes_API_DB = async(idRecipes)=>{
    try{
        const api = await getRecipesIdApi(idRecipes);
        const db = await getRecipesIdBD(idRecipes);
            
        if(db.length > 0) return db;
        else if(api.length > 0) return api;
    }catch(err){
        return err;
    }
   
}
//?------------------------POST/RECIPES----------------------------------------------
const postRecipe =async (req,res)=>{
    try{
        const {name,summary,healthScore,steps,dietId} = req.body;
        const newRecipe =await Recipe.create({
            name,
            summary,
            healthScore,
            steps,
        })
        dietId.forEach(async(diet) =>{
            const result = await Diet.findAll({
                where: {
                    id: diet
                }
            });
            await newRecipe.addDiet(result);
        })
        return res.json("Receta agregada con éxito")

    }catch(err){
        return res.status(400).json({err: err.message});
    }
}






module.exports = {
    allRecipes_DB_API,
    getRecipesQuery,
    idRecipes_API_DB,
    postRecipe,
    
    
}
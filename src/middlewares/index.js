const validateRecipe = (req,res,next) => {
    const {name,summary,healthScore} =req.body;

    const words = new RegExp(/^[a-zA-Z ]+$/);
    const numbers = new RegExp(/^[0-9]+$/);


    if(!name) return res.status(400).json({error: "El nombre es obligatorio"});
    else if(!words.test(name))return res.status(400).json({error: "No se permiten símbolos ni números"});
    else if(!summary) return res.status(400).json({error: "El resumen del plato es obligatorio"});
    else if(!words.test(summary)) return res.status(400).json({error: "No se permiten símbolos ni números"})
    else if(healthScore < 1 || healthScore >100)return res.status(400).json({error: "El nivel de comida saludable tiene que ser entre uno y cien"});
    else if(!numbers.test(healthScore)) return res.status(400).json({error: "El valor ingresado tiene que ser numerico"})
    
    next();
}

module.exports = {
    validateRecipe
}
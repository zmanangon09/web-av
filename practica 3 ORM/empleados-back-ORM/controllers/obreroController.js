import Obrero from "../models/obrero.js";

//crear un nuevo obrero
export const crearObrero =async (req ,res)=>{
    try{
        const {nombreCompleto, horasTrabajadas} = req.body;
        if(!nombreCompleto || !horasTrabajadas){
            return res.status(400).json({mensaje:"Ingresar el Nombre y el numero de horas trabajadas"});
        }

        const nuevoObrero = await Obrero.create({
            nombreCompleto,
            horasTrabajadas,
        });
        return res.status(201).json(nuevoObrero);

    }catch(error){
        res.status(500).json({mensaje: "Error al crear el obrero", error: error.message})

}
};

//listar todos los obreros

export const listarObreros = async (req, res) => {
    try {
        const obreros = await Obrero.findAll();

        res.json(obreros);


    }catch (error) {
        res.status(500).json({ mensaje: "Error al listar todos los obreros", error: error.message });
    }
};

//buscar por ID

export const buscarPorId =async (req ,res)=>{
    try{
        
        const obrero = await Obrero.findByPk(req.params.id);

        if(!obrero){return res.status(404).json({mensaje: "obrero no encontrado"});
        }
        res.json(obrero);
    }catch(error){
        res.status(500).json({mensaje: "Error al buscar el obrero", error: error.message})

}
};

//actualizar obrero
export const actualizarObrero =async (req ,res)=>{
    try{
        const obrero = await Obrero.findByPk(req.params.id);
        if(!obrero){
            return res.status(404).json({mensaje:"Obrero no encontrado"})
        }
           const {nombreCompleto, horasTrabajadas} = req.body;
            await obrero.update({
                nombreCompleto,
                horasTrabajadas,
            });
            res.json(obrero);
    }catch(error){
        res.status(500).json({mensaje: "Error al actualizar el obrero", error: error.message})
    }
    
    
}

//eliminar obrero
export const eliminarObrero =async (req ,res)=>{
    try{
        const obrero = await Obrero.findByPk(req.params.id);
        if(!obrero){
            return res.status(404).json({message:"Obrero no encontrado"});
        }
        await obrero.destroy();
        res.json({mensaje:"Obrero eliminado correctamente"});

    }catch(error){
        res.status(500).json({mensaje: "Error al eliminar el obrero", error: error.message})
    }
}

// Calcular salario semanal
export const calcularSalarioSemanal = async (req, res) => {
  try {
    const obrero = await Obrero.findByPk(req.params.id);
    if (!obrero) return res.status(404).json({ mensaje: "Obrero no encontrado." });

    const salario = obrero.calcularSalario();
    res.json({
      id: obrero.id,
      nombreCompleto: obrero.nombreCompleto,
      horasTrabajadas: obrero.horasTrabajadas,
      ...salario
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al calcular el salario.", error: error.message });
  }
};
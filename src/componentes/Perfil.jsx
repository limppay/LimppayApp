import { useState} from "react"

export default function Perfil(){
    const [image, setImage] = useState("src/assets/img/diarista-cadastro/user.png")
    
    // estou transformando o objeto/arquivo ( imagem ), em um link, para depois utilizar ele
    const handleImageChange = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-2">
                <label htmlFor="fotoPerfil" className="cursor-pointer flex justify-center flex-col items-center gap-1">
                    <img src={image} alt="foto de perfil" className="transition-all duration-200 rounded-full w-60 h-60 hover:bg-ter p-0.5 hover:bg-opacity-40" />                  
                    <input type="file" name="fotoPerfil" id="fotoPerfil" required accept="image/*" onChange={handleImageChange} className=" p-2 w-full hidden"/>                      
                </label>
                <span className="text-prim">Foto de perfil</span>  
            </div>
            
        </div>
    )
}
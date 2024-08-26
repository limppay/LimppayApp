import { useState} from "react"

export default function AnexoForm({name, text, span}){

    const [fileName, setFileName] = useState("Arquivo não selecionado")

    const handleNameChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setFileName(file.name)
        } else {
            setFileName("Arquivo não selecionado")
        }
    }
    
    return(
        <div className="mt-4 text-prim pr-9 pl-9">
            <label htmlFor={name}>
                {text} 
                <span>{span}</span>
                <div className="border gap-3 border-bord rounded-md flex items-center lg:gap-5 ">
                    <div className="p-1 bg-prim bg-opacity-90 text-white rounded-l-md lg:p-3 h-12">
                        <p>Selecione o arquivo</p>
                        <input type="file" name={name} id={name}  required accept="application/pdf, image/*" className=" p-2 w-full hidden" onChange={handleNameChange}/>
                    </div>
                    <div className="flex  overflow-hidden lg:text-start">
                        <span className="max-w-28 max-h-12 lg:max-w-xl">{fileName}</span>
                    </div>
                </div>           
            </label>       
        </div>
    )
}
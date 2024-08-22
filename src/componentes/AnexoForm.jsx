export default function AnexoForm({name, text, span}){
    return(
        <div className="mt-4 text-prim pr-9 pl-9">
            <label htmlFor={name}>
                {text} 
                <span>{span}</span>
                <div className="border border-bord rounded-md p-2 flex">
                    <div>
                        <input type="file" name={name} id={name}  required accept="application/pdf, image/*" className=" p-2 w-full"/>
                    </div>   
                </div>           
            </label>       
        </div>
    )
}
import OptionsForm from "./home/OptionsForm"


export default function SelectForm(options) {
    return (
        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
            <select name="estadoCivil" id="estadoCivil" required className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim">
                <option defaultValue >Selecione</option>
                {options.map((options, index) => (
                    <OptionsForm key={index} value={index} text={options.text}/>
                ))}
            </select>
        </div>
    )
}
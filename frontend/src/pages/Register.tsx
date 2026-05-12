import {useState} from "react";
import {useNavigate,Link} from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [form,setForm] = useState({name:"",email:"",password:"",avatar:""})
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError("");
        try{
            await axios.post('http://localhost:3000/api/users/auth/register',form);
            navigate('/login');
        }catch(err:any){
            setError(err.response?.data?.error?.[0] ?? "Erro no registo")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-x1 shadow w-full max-w-md">
                <h1 className="text2x1 font-bold mb-6 text-center">Criar Conta</h1>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {(['name','email','password','avatar'] as const).map(field=>(
                        <input key={field} className="border rounded-lg p-3"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        type={field === 'password' ? 'password' :field === 'email' ? 'email': 'text'}
                        value={form[field]}
                        onChange={e=>setForm({...form,[field]:e.target.value})}
                        required={field !== 'avatar'}/>
                    ))}
                    <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                        Registar
                    </button>            
                </form>
                <p className="text-center mt-4 text-sm text-grey-500">
                    Já tens conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
                </p>
            </div>
        </div>
    )
}
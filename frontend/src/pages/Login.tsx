import React, {useState} from "react";
import {useNavigate,Link} from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const hanldleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        try{
            const res = await axios.post('http://localhost:3000/api/users/auth/login',{email,password});
            localStorage.setItem('token',res.data.token);
            navigate('/');
        }catch{
            setError("Credencias invalidas");
        }
    };
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-x1 shadow w-full max-w-md">
                <h1 className="text-2x1 font-bold mb-6 text-center">Entrar no Life Threads</h1>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={hanldleSubmit} className="flex flex-col gap-4">
                    <input className="border rounded-lg p-3" type="email" placeholder="Email"
                    value={email} onChange={e=>setEmail(e.target.value)} required/>
                    <input className="border rounded-lg p-3" type="password" placeholder="Password"
                    value={password} onChange={e=>setPassword(e.target.value)} required/>
                    <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                        Entrar
                    </button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-500">
                    Não tens conta? <Link to="/regisster" className="text-blue-600 hover:underline">Registar</Link>
                </p>
            </div>
        </div>
    );
}
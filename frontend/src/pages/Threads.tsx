import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';

interface Thread {id:number,title:string,description:string,visibility:boolean,created_at:string}

export default function Threads() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL:'http://localhost:3000',
        headers:{Authorization:`Bearer ${token}`}
    })
    useEffect(()=>{api.get('/api/threads').then(r=>setThreads(r.data));},[]);

    const createThread = async(e:React.FormEvent)=>{
        e.preventDefault();
        const res = await api.post('/api/threads',{title,description});
        setThreads([res.data,...threads]);
        setTitle('');
        setDescription('');
    };

    return (
        <>
            <Navbar />
            <div className="max-w-3x1 mx-auto p-6">
                <h1 className="text-2x1 font-bold mb-6">As minhas Threads</h1>
                <form onSubmit={createThread} className="bg-white rounded-x1 shadow p-4 mb-8 flewx flex-col gap-3">
                    <h2 className="font-semibold text-lg">Nova Thread</h2>
                    <input className="border rounded-lg p-2" placeholder="Titulo" value={title}
                    onChange={e=> setTitle(e.target.value)} required/>
                    <textarea className="border rounded-lg p-2" placeholder="Descricao" value={description}
                    onChange={e=>setDescription(e.target.value)} rows={2} required />
                    <button className="bg-blue-600 text-white py-2 rounded-lg hovewr:bg-blue-700">
                        Criar
                    </button>
                </form>
                <div className="flex flex-col gap-4">
                    {threads.map(t=>(
                        <Link key={t.id} to={`/threads/${t.id}`}
                        className="bg-white rounded-x1 shadow p-4 hover:shadow-md transition block">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-semibold text-lg">{t.title}</h2>
                                    <p className="text-gray-500 text-sm">{t.description}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${t.visibility ? 'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                                    {t.visibility ? 'Publica':'Privada'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>   
            </div>    
        </>
    )
}
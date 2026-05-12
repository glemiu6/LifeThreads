import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import Navbar from "../components/layout/Navbar";

interface Entry {id:number; title:string;body:string;entry_data:string;is_published:boolean}
export default function ThreadDetail() {
    const {id} = useParams();
    const [thread,setThread] = useState<any>(null);
    const [entries, setEntries] = useState<Entry[]>([])
    const [form,setForm] = useState({title:'',body:'',location:''});
    const token = localStorage.getItem('token')
    const api = axios.create({baseURL:'http://localhost:3000',headers:{Authorization:`Bearer ${token}`}});

    useEffect(()=>{
        api.get(`/api/threads/${id}`).then(r=>setThread(r.data));
        api.get(`/api/threads/${id}/entries`).then(r=>setEntries(r.data));
    },[id]);

    const createEntry = async (e:React.FormEvent)=>{
        e.preventDefault();
        const res = await api.post(`/api/threads/${id}/entries`,form);
        setEntries([res.data,...entries]);
        setForm({title:"",body:"",location:''});
    };

    const togglePublish = async(entry:Entry)=>{
        const url = `/api/entries/${entry.id}/${entry.is_published ? 'unpublish':'publish'}`;
        const res = await api.put(url);
        setEntries(entries.map(e=>e.id === entry.id ? res.data : e));
    };

    const deleteEntry = async(entryId:number)=>{
        await api.delete(`/api/entries/${entryId}`);
        setEntries(entries.filter(e=>e.id !== entryId));
    };

    if (!thread) return <><Navbar /><div className="p-8">A carregar...</div></>;
    return (
        <>
            <Navbar />
            <div className="max-w-3x1 mx-auto p-6">
                <h1 className="text-2x1 font-bold mb-1">{thread.title}</h1>
                <p className="text-gray-500 mb-6">{thread.description}</p>

                <form onSubmit={createEntry} className="bg-white rounded-x1 shadow p-4 mb-8 flex flex-col gap-3">
                    <h2 className="font-semibold">Nova Entrada</h2>
                    <input className="border rounded-1g p-2" placeholder="Titulo" value={form.title}
                    onChange={e=>setForm({...form,title:e.target.value})} required />
                </form>
            </div>
        </>
    )
}
import { useEffect, useState } from "react";
import { dbService } from "fbase";

const Home =()=> {
    const [ntwit,setNtwit] = useState("");
    const [ntwits,setNtwits] = useState([]);
    
    const onSubmit = async(e)=>{
        console.log("Asdfasdf")
        e.preventDefault()
        await dbService.collection("ntwit").add({
            text:ntwit, 
            createdAt:Date.now()
        })
        setNtwit("")
    } 
    const getNtwit = async () => {
        const dbNtwit = await dbService.collection("ntwit").get()
        
        dbNtwit.forEach((doc)=> {
            const ntwitObj = {...doc.data(), id:doc.id}
            setNtwits((prev)=>[ntwitObj,...prev]) 
        })
    };
    const onChange = (e)=>{
        e.preventDefault();
        const {
            target:{value}
        } = e
        setNtwit(value)
    };
    useEffect(()=>{getNtwit()},[])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={ntwit} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="New Twit"/>
            </form>
            <div>
                {
                    ntwits.map((nt)=>(
                        <div key={nt.id}>
                            <h4>{nt.text}</h4>
                        </div>
                    ))
                }
            </div>
        </>
    )
};

export default Home;
import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Ntwit from "components/Ntwit";

const Home =({userObj})=> {
    const [ntwit,setNtwit] = useState("");
    const [ntwits,setNtwits] = useState([]);
    
    const onSubmit = async(e)=>{
        console.log("Asdfasdf")
        e.preventDefault()
        await dbService.collection("ntwit").add({
            text:ntwit, 
            createdAt:Date.now(),
            creatorId:userObj.uid
        })
        setNtwit("")
    } 
 
    const onChange = (e)=>{
        e.preventDefault();
        const {
            target:{value}
        } = e
        setNtwit(value)
    };
    useEffect(()=>{
        dbService.collection("ntwit").onSnapshot((snapShot)=>{
            const newArr = snapShot.docs.map((doc)=>({
                id:doc.id, ...doc.data()
            }));
            setNtwits(newArr)
        })
    },[])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={ntwit} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="New Twit"/>
            </form>
            <div>
                {
                    ntwits.map((nt)=>(
                       <Ntwit key={nt.id} nt={nt} isOwner={nt.creatorId === userObj.uid} />
                    ))
                }
            </div>
        </>
    )
};

export default Home;
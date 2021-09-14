import { useEffect, useState } from "react";
import { dbService , storageService } from "fbase";
import Ntwit from "components/Ntwit";
import {v4 as uuidv4} from "uuid"

const Home =({userObj})=> {
    const [ntwit,setNtwit] = useState("");
    const [ntwits,setNtwits] = useState([]);
    const [attachment, setAttachment] = useState("");
    
    const onSubmit = async(e)=>{
        e.preventDefault()
        let attachmentUrl = ""
        if( attachment !== "" ){
            const attachmentRef =  storageService.ref().child( `${userObj.uid}/${uuidv4()}` )
            const response = await attachmentRef.putString(attachment,"data_url")
            attachmentUrl = await response.ref.getDownloadURL();
        }
                
        await dbService.collection("ntwit").add({
            text:ntwit, 
            createdAt:Date.now(),
            creatorId:userObj.uid,
            attachmentUrl
        })
        setNtwit("")
        setAttachment("")
    } 
 
    const onChange = (e)=>{
        e.preventDefault();
        const {
            target:{value}
        } = e
        setNtwit(value)
    };

    const onFileChange = (e)=>{
        const { target:{ files } } = e
        const theFile = files[0]
        const reader = new FileReader()
        reader.readAsDataURL(theFile)
        reader.onload = (finishEvent)=>{
            const { currentTarget : {result} } = finishEvent
            setAttachment(result)
        }
    }
    const onClearAttachment = () => setAttachment("")

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
                <input type="file" value="" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="New Twit"/>
                { attachment && <> <img src={attachment} width="50px" height="50px" alt="" /> <button onClick={onClearAttachment}>Clear</button> </> }
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
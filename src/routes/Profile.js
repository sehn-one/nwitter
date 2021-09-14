/* eslint-disable array-callback-return */
import { authService , dbService } from "fbase";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom"
import Ntwit from "components/Ntwit";
const Profile =({userObj,refreshUser})=> {
    const [ntwits,setNtwits] = useState([]);
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
    
    const onLogOutClick=()=>{
        authService.signOut();
        history.push("/")
    } 
    const onChange = (e)=>{
        const { target:{ value } } = e
        setNewDisplayName(value)
    }
    const onSubmit = async(e)=>{
        e.preventDefault();
        if( userObj.displayName !== newDisplayName ){
            await userObj.updateProfile({displayName:newDisplayName});
            refreshUser();
        }
    }
    const getMyNtwit = async()=>{        
        const result = await dbService.collection("ntwit").where("creatorId","==",userObj.uid).orderBy("createdAt","asc").get()        
        setNtwits(result.docs.map((doc)=>{ return {"id" : doc.id, ...doc.data()} } ) )        
    }
    useEffect( ()=>{
        getMyNtwit();
    }, [] )

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display Name" onChange={onChange} value={newDisplayName} />
                <input type="submit" value="Updat Profile"/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
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

export default Profile;
import { dbService } from "fbase"
import { useEffect, useState } from "react"

const Ntwit = ({nt,isOwner})=>{
    const [editing,setEditing] = useState(false)
    const [currentTwit,setCurrentTwit] = useState(nt.text)
    
    const onDeleteClick= async ()=>{
        const ok = window.confirm("삭제하시겠습니까?")
        if(ok){
            await dbService.doc(`ntwit/${nt.id}`).delete()
        }
    }
    const toggleEditing=  ()=>{
        setEditing((prev)=>!prev)
    }
    const onChange=(e)=>{
        const {target:{value}} = e
        setCurrentTwit(value)
    }
    const onSubmit=async(e)=>{
        e.preventDefault();
        await dbService.doc(`ntwit/${nt.id}`).update({text:currentTwit})
        setEditing(false);
    }
    return (
        <div>
            {
                editing?(
                    <>
                        <form onSubmit={onSubmit}>
                            <input onChange={onChange} value={currentTwit} required />
                            <input type="submit" value="Update Ntwit" />
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ):(
                    <>
                        <h4>{nt.text}</h4>
                        {isOwner &&
                            (
                                <>
                                    <button onClick={onDeleteClick}>Delete Ntwit</button>
                                    <button onClick={toggleEditing}>Modify Ntwit</button>
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default Ntwit;
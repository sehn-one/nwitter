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
    return (
        <div>
            {
                editing?(
                    <>
                        <form>
                            <input onChange={onChange} value={currentTwit} required />
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
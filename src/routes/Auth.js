import { useState } from "react";
import { authService } from "fbase";
import { firebaseInstance } from "../fbase";
const Auth =()=> {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true)
    const [error,setError] = useState("")

    const toggleAccount=()=>setNewAccount((prev)=>!prev);
    const onChange = (event)=>{
        const { 
            target : {name, value},
        } = event;
        if (name === "email"){
            setEmail(value)
        }
        else if(name ==="password"){
            setPassword(value)
        }
    }
    const onSubmit = async (event)=>{
        event.preventDefault();
        let data;
        try{
            if(newAccount){
                data = await authService.createUserWithEmailAndPassword(email,password);
            }else{
                data = await authService.signInWithEmailAndPassword(email, password)
            }
            console.log(data)
        }catch(e){
            setError(e.message)
        }
        
    }

    const onSocialClick= async(e)=>{
        const { 
            target :{ name },
        } = e
        let provider;
        if(name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider()
        }else if( name==="github"){
            provider = new firebaseInstance.auth.GithubAuthProvider()
        }
        const data = await authService.signInWithPopup(provider)
        console.log(data)
    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" value={email} onChange={onChange} required/>
                <input name="password" type="password" placeholder="Password" value={password}  onChange={onChange}  required/>
                <input type="submit" value={newAccount? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount?"Sign In":"Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue With Google</button>
                <button onClick={onSocialClick} name="github">Continue With Github</button>
            </div>
        </div>
    )
};
export default Auth;
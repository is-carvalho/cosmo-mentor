import jwt_decode from 'jwt-decode'

export const isAuthenticated = () =>{
    const now = (Date.now() / 1000)

    if (localStorage.usertoken){
        let token = jwt_decode(localStorage.usertoken)
        if (token.exp > now){
            //console.log("token de autorização: ",[token.exp, now]);
            return {
                status: true, 
                tipo: token.tipo + ''
            }
        }else{
            localStorage.removeItem('usertoken')
            //localStorage.usertoken = ""
            return {
                status: false
            }
        }
    }else{
        return {
            status: false
        }
    }
}
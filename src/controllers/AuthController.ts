export const  isAuthenticated = () => {
    let access_token = localStorage.getItem('store_access_token');
    if(access_token && access_token.length > 0){
        return true;
    }
    return false;
}

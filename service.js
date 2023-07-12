
function getApiData(){
    const headers = { 'Authorization': 'Token e7397ecab41367c2816229206deb4c107114465c' };
    try{
        return fetch('https://api.sharpsports.io/v1/bettors/BTTR_905bfe2180fd47f6b72557a8db374a09/betSlips', { headers })
            .then(response => response.json())
            .then(data => data);
    }catch(e){
        console.log(e)
    }     
}

export default getApiData

import axios from 'axios';

const post = async function(url, data, headers){
    try{
        const postResponse = await axios.post(url, data, {headers});
        const response = await postResponse.json();
        return response
    }
    catch(err){
        return err;
    }

}

const get = async function(){
    try{
        const getResponse = await axios.get(url, {headers});
        const response = await getResponse.json();
        return response;
    }
    catch(err){
        return err;
    }
}

module.exports = {
    post,
    get,
}
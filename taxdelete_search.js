const accountName = "sbdbrqa";
const VtexIdclientAutCookie = "Adicionar Cookie"

const axios = require('axios');
const instance = axios.create({
    headers: {
        VtexIdclientAutCookie,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

(async () => {
    await process()
})();

async function process() {
    let start = "0";
    let end = "50";
    let total = "100000";
    let deleted = 0;
    let requestArray = [];
    while (total!==0) {
        try{
        const { data: taxes, headers } = await instance.get(`https://${accountName}.myvtex.com/api/dataentities/TS/search?_fields=id`, { headers: { 'REST-Range': `resources=${start}-${end}` } });
        for (const tax of taxes) {
            console.log(tax.id)
            requestArray.push(instance.delete(`https://${accountName}.myvtex.com/api/dataentities/TS/documents/${tax.id}`))
        }
        await Promise.allSettled(requestArray)
        total = headers['rest-content-range'].split("/")[1];
        start = (parseInt(end) + 1).toString();
        end = (parseInt(end) + 50).toString();
        deleted = deleted + 50;
        console.log(deleted)
        console.log(total)
        requestArray = [];
        await later(5000)
        }
        catch(e){
            await process()
        }
    }
}

function later(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}
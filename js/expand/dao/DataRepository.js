/**
 * Created by penn on 2016/12/21.
 */

export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject)=> {
            fetch(url)
                .then(res=>res.json())
                .then(res=>{
                    resolve(res)
                })
                .catch(error=>{
                    reject(error)
                })
        })
    }
}
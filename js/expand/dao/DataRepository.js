/**
 * Created by penn on 2016/12/21.
 */

import {AsyncStorage} from 'react-native'
export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
    }

    saveRepository(url, items, callback) {
        if (!items || !url)return;
        let wrapData = {items: items, update_date: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    /**
     * 判断数据是否过时
     * @param longTime 数据的时间戳
     * @returns {boolean}
     */
    checkData(longTime){
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime)
        if(cDate.getMonth() !== tDate.getMonth()) return false;
        if(cDate.getDay()!==tDate.getDay())return false;
        if(cDate.getHours()-tDate.getHours()>4)return false;
        return true
    }


    fetchRepository(url) {
        return new Promise((resolve, reject)=> {
            this.fetchLocalRepository(url).then((wrapData)=> {
                if (wrapData) {
                    resolve(wrapData, true);
                } else {
                    this.fetchNetRepository(url).then((data)=> {
                        resolve(data);
                    }).catch((error)=> {
                        reject(error);
                    })
                }

            }).catch((error)=> {
                this.fetchNetRepository(url).then((data)=> {
                    resolve(data);
                }).catch((error=> {
                    reject(error);
                }))
            })
        })
    }

    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject)=> {
            fetch(url)
                .then(res=>res.json())
                .then(res=>{
                    if(res){
                        resolve(res.items)
                        this.saveRepository(url,res.items)
                    }else{
                        reject(new Error('responseData is null'))
                    }
                })
                .catch(error=>{
                    reject(error)
                })
        })
    }
}
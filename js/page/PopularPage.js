/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native'
import FavoriteDao from '../expand/dao/FavoriteDao'
import NavigationBar from '../common/NavigationBar';
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository';
import RepositoryCell from '../common/RepositoryCell'
import RepositoryDetail from './RepositoryDetail'
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ScrollableTableView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao =  new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.state = {
            languages:[]
        }
    }

    componentDidMount(){
        this.loadData()
    }

    loadData() {
        this.languageDao.fetch()
            .then(res => {
                this.setState({
                    languages: res
                })
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {
        let content = this.state.languages.length>0?
            <ScrollableTableView
                renderTabBar={()=><ScrollableTabBar/>}
            >
                {this.state.languages.map((result,i,arr)=>{
                    let lan = arr[i]
                    return lan.checked?
                        <PopularTab key={i} tabLabel={lan.name} {...this.props}></PopularTab>:null
                })}
            </ScrollableTableView>:null
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='最热'
                    statusBar={{
                        backgroundColor: '#2196F3'
                    }}
                />
                {content}
            </View>
        )
    }
}
class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading:false,
            favoriteKeys:[]
        }
    }

    componentDidMount() {
        this.loadData();
    }
    /**
     * 获取本地用户收藏的ProjectItem
     */
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then((keys)=> {
            if (keys) {
                this.updateState({favoriteKeys: keys});
            }
            this.flushFavoriteState();
        }).catch((error)=> {
            this.flushFavoriteState();
            console.log(error);
        });
    }
    /**
     * 更新ProjectItem的Favorite状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            // Utils.checkFavorite(items[i],this.state.favoriteKeys)
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i],this.state.favoriteKeys)));

        }
        this.updateState({
            isLoading: false,
            isLoadingFail: false,
            dataSource: this.getDataSource(projectModels),
        });
    }

    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }
    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    /**
     * 获取本地用户收藏的ProjectItem
     */
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then((keys)=> {
            if (keys) {
                this.updateState({favoriteKeys: keys});
            }
            this.flushFavoriteState();
        }).catch((error)=> {
            this.flushFavoriteState();
            console.log(error);
        });
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        let url=this.genFetchUrl(this.props.tabLabel);

        //先读缓存,再读接口
        this.dataRepository
            .fetchRepository(url)
            .then(result=> {
                let items = this.items = result && result.items?result.items:result?result:[]
                this.getFavoriteKeys()
                if(result&&result.update_date&&!this.dataRepository.checkData(result.update_date)){
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items=>{
                if(!items|| items.length ==0 )return
                this.items = items
                this.getFavoriteKeys()
            })
            .catch(error=> {
                console.log(error)
                this.updateState({
                    isLoading: false
                });
            })
    }
    /**
     * favoriteIcon单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }


    onSelect(projectModel){
        this.props.navigator.push({
            title:projectModel.item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel:projectModel,
                ...this.props,
            },
        });
    }


    renderRow(projectModel) {
        return <RepositoryCell
            key={projectModel.item.id}
            projectModel={projectModel}
            onSelect={()=>this.onSelect(projectModel)}
            onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}/>
    }

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        title='Loading...'
                        titleColor='#2196F3'
                        colors={['#2196F3']}
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        tintColor='#2196F3'
                    />
                }
            />
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    tips: {
        fontSize: 29
    }
})

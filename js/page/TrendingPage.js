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
import NavigationBar from '../common/NavigationBar';
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository';
import TrendingCell from '../common/TrendingCell'
import RepositoryDetail from './RepositoryDetail'

import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ScrollableTableView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'

const API_URL = 'https://github.com/trending/';
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao =  new LanguageDao(FLAG_LANGUAGE.flag_language)
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
                        <TrendingTab key={i} tabLabel={lan.name} {...this.props}></TrendingTab>:null
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
class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading:false
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        let url=this.genFetchUrl('?since=daily',this.props.tabLabel);

        //先读缓存,再读接口
        this.dataRepository
            .fetchRepository(url)
            .then(result=> {
                let items = result && result.items?result.items:result?result:[]
                this.setState({
                    isLoading: false,
                    dataSource:this.state.dataSource.cloneWithRows(items)
                })
                DeviceEventEmitter.emit('showToast','显示缓存数据')
                if(result&&result.update_date&&!this.dataRepository.checkData(result.update_date)){
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items=>{
                if(!items|| items.length ==0 )return
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(items)
                })
                DeviceEventEmitter.emit('showToast','显示网络数据')
            })
            .catch(error=> {
                console.log(error)
                this.setState({
                    isLoading: false
                });
            })
    }
    genFetchUrl(tiemSpan,category) {
        return API_URL + category + tiemSpan.searchText;
    }


    onSelect(item){
        this.props.navigator.push({
            component: RepositoryDetail,
            params: {
                item:item,
                ...this.props,
            },
        });
    }


    renderRow(data) {
        return <TrendingCell
            onSelect={()=>this.onSelect(data)}
            key={data.id}
            data={data}
        />
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

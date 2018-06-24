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
    DeviceEventEmitter,
    TouchableOpacity,
    Image
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository';
import TrendingCell from '../common/TrendingCell'
import RepositoryDetail from './RepositoryDetail'

import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'

import ScrollableTableView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
const API_URL = 'https://github.com/trending/';
var timeSpanTextArray = [new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'), new TimeSpan('本 月', 'since=monthly')]
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao =  new LanguageDao(FLAG_LANGUAGE.flag_language)
        this.state = {
            languages:[],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
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

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }
    closePopover() {
        this.setState({isVisible: false});
    }
    renderTitleView() {
        return <View >
            <TouchableOpacity
                ref='button'
                underlayColor='transparent'
                onPress={()=>this.showPopover()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <Image
                        style={{width: 12, height: 12, marginLeft: 5}}
                        source={require('../../res/images/ic_spinner_triangle.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }

    render() {
        let navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={{backgroundColor: "#2196F3"}}
            />;
        let timeSpanView=
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={()=>this.closePopover()}
                contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
                style={{backgroundColor: 'red'}}>
                <View style={{alignItems: 'center'}}>
                    {timeSpanTextArray.map((result, i, arr) => {
                        return <TouchableOpacity key={i} onPress={()=>this.onSelectTimeSpan(arr[i])}
                                                 underlayColor='transparent'>
                            <Text
                                style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                                {arr[i].showText}
                            </Text>
                        </TouchableOpacity>
                    })
                    }
                </View>
            </Popover>
        let content = this.state.languages.length>0?
            <ScrollableTableView
                renderTabBar={()=><ScrollableTabBar/>}
            >
                {this.state.languages.map((result,i,arr)=>{
                    let language = arr[i]
                    return language.checked?
                        <TrendingTab key={i} tabLabel={language.name} timeSpan={this.state.timeSpan} {...this.props}/> : null;
                })}
            </ScrollableTableView>:null
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {timeSpanView}
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

    onRefresh(){
        this.loadData(this.props.timeSpan,true);
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan,true);
    }

    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }
    }

    loadData(timeSpan,isRefresh) {
        this.updateState({
            isLoading: true
        })
        let url=this.genFetchUrl(timeSpan,this.props.tabLabel);
        //先读缓存,再读接口
        this.dataRepository
            .fetchRepository(url)
            .then(result=> {
                let items = result && result.items?result.items:result?result:[]
                this.updateState({
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
                this.updateState({
                    dataSource:this.state.dataSource.cloneWithRows(items)
                })
                DeviceEventEmitter.emit('showToast','显示网络数据')
            })
            .catch(error=> {
                console.log(error)
                this.updateState({
                    isLoading: false
                });
            })
    }
    genFetchUrl(timeSpan, category) {//objective-c?since=daily
        return API_URL + category + '?' + timeSpan.searchText;
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
                        onRefresh={()=>this.onRefresh()}
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

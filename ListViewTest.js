/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ListView,
    RefreshControl
} from 'react-native'
import NavigationBar from './NavigationBar'
import Toast, {DURATION} from 'react-native-easy-toast'

var data = {
    "result": [
        {
            'email': 'asdasdasd@qq.com',
            'fullName': '张三张三张三'
        },
        {
            'email': 'asdasdasdasdasd@qq.com',
            'fullName': '张三张三张三张三'
        },
        {
            'email': 'asdasdasdasdasd@qq.com',
            'fullName': '张四张三张三张三'
        },
        {
            'email': 'asdasdasdasdasd@qq.com',
            'fullName': '张四张三张三张三'
        },
        {
            'email': 'asdasdasd@qq.com',
            'fullName': '张三张三张三'
        },
        {
            'email': 'asdasdasd@qq.com',
            'fullName': '张三张三张三'
        },
        {
            'email': 'asdasdasd@qq.com',
            'fullName': '张三张三张三'
        }
    ],
    statusCode: 0
}

export default class ListViewTest extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        //初始向
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isLoading:true,
        }
        this.onLoad()
    }

    renderRow(item) {
        return <View style={styles.row}>
            <TouchableOpacity
                onPress={()=>{
                    this.toast.show('你单击了:'+item.fullName,DURATION.LENGTH_SHORT)
                }}
            >
                <Text style={styles.tips}>{item.fullName}</Text>
                <Text style={styles.tips}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    }

    renderSqearator(SectionId, rowID, adjacentRowHighlighted) {
        return <View key={rowID} style={styles.line}></View>
    }

    renderFooter() {
        return <Image style={{widht: 400, height: 100}}
                      source={{uri: 'https://img.mukewang.com/58b7d4ac0001699006000338-240-135.jpg'}}/>
    }

    onLoad(){
        setTimeout(()=>{
            this.setState({
                isLoading:false
            })
        },2000)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='ListViewTest'
                />
                <ListView dataSource={this.state.dataSource}
                          renderRow={item => this.renderRow(item)}
                          renderSeparator={(SectionId, rowID, adjacentRowHighlighted) => this.renderSqearator(SectionId, rowID, adjacentRowHighlighted)}
                          renderFooter={() => this.renderFooter()}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isLoading}
                                  onRefresh={()=>this.onLoad}
                              />
                          }
                />
                <Toast ref={toast => {
                    this.toast = toast
                }}/>
            </View>)
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tips: {
        fontSize: 18
    },
    row: {
        height: 50
    },
    line: {
        height: 1,
        backgroundColor: 'black'
    }
})

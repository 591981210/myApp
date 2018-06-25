/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    WebView,
    TextInput,
    DeviceEventEmitter
} from 'react-native'

import ViewUtils from '../util/ViewUtils'
import NavigationBar from '../../js/common/NavigationBar'
const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url
            : TRENDING_URL + this.props.projectModel.item.fullName;
        var title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name
            : this.props.projectModel.item.fullName;
        this.state = {
            url: this.url,
            canGoBack:false,
            title:title,
        }
    }

    search() {
        this.setState({
            url:this.searchText
        })
    }
    onNavigationStateChange(e){
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
            title:e.title
        });
    }
    goBack(){
        if(this.state.canGoBack){
            this.webView.goBack();
        }else {
            this.props.navigator.pop()
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#6495ED'}}
                    letfButton={ViewUtils.getLeftButton(()=>this.onBack())}
                />
                <WebView
                    ref={webView=>this.webView=webView}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
                    startInLoadingState={true}
                />
            </View>)
    }
}
const styles = StyleSheet.create({
        container: {
            flex: 1,

        },
        button: {
            fontSize: 16,
            padding:5
        },
        input: {
            borderWidth: 1,
            height: 40,
            flex:1,
            marginLeft:5
        },
        searchContainer: {
            flexDirection:'row',
            alignItems:'center',
            margin:10,
            marginLeft:0
        }
    }
)

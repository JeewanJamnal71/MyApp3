import React, { useEffect, useId, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Button,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import getApiData from './service';
import { getDBConnection, createTable, updateTable, getDataFromTable, filterDbData } from './db-service';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [tableData, setTableData] = useState([])

  useEffect(()=>{
    try{
      getDBConnection()
    }catch(e){}
    
  },[])

  useEffect(()=>{
    async function getData(){
      let fetchData = await getApiData()
      if(fetchData && fetchData.length>0){
        createTable().then(async(data) => {
            updateTable(fetchData).then(async(data) => {
              let tabelData = await getDataFromTable()
                if(tabelData && tabelData.length>0){
                  setTableData(tabelData)
                }
            })
            .catch((error) => {
              console.log("update",error);
            });
        })
        .catch((error) => {
          console.log("create",error);
        });
      }
    }
    getData()
    
  },[])

  const filterData=async(type:string)=>{
    let _filteredData = await filterDbData(type)
    console.log("length>>>>",_filteredData.length)
    if(_filteredData && _filteredData.length>0){
      setTableData(_filteredData)
    }
  }

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      
      <View style={{width:windowWidth,height:windowHeight,paddingTop:windowHeight*.02}}>
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <Text style={{fontSize:16, fontWeight:'bold',paddingLeft:10}}>Filter</Text>
          <View style={{height:windowHeight*.12, marginTop:windowHeight*.02}}>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
              <TouchableHighlight style={styles.buttonContainer} activeOpacity={0.6} underlayColor="#CCCCCC" onPress={()=>filterData('week')}>
                <Text style={styles.buttonLabelStyle}>Weekly</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer} activeOpacity={0.6} underlayColor="#CCCCCC" onPress={()=>filterData('month')}>
                <Text style={styles.buttonLabelStyle}>Monthly</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer} activeOpacity={0.6} underlayColor="#CCCCCC" onPress={()=>filterData('year')}>
                <Text style={styles.buttonLabelStyle}>Yearly</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer} activeOpacity={0.6} underlayColor="#CCCCCC" onPress={()=>filterData('name')}>
                <Text style={styles.buttonLabelStyle}>Name</Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
          
          {
            tableData && tableData.length>0 ? tableData.map((data,index)=>{
              return(<View key={data?.id+index} style={{width:300,height:100,backgroundColor:'#CCCCCC',borderRadius:5,alignSelf:'center',alignItems:'center',justifyContent:'center',marginTop:5}}>
                      <Text style={{color:'#111',fontSize:12}}>Id: {data?.id}</Text>
                      <Text style={{color:'#111',fontSize:12}}>Time: {data?.timePlaced}</Text>
                    </View>)
            }) :  <ActivityIndicator size="large" />
          }
        </ScrollView>
      </View>
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width:100,
    height:60,
    backgroundColor:'red',
    alignItems:'center',
    justifyContent:'center',
    marginLeft:10,
    borderRadius:5
  },
  buttonLabelStyle:{
    color:'#fff',
    fontSize:14
  }
});

export default App;

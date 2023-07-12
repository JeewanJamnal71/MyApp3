/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useId, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';
import getApiData from './service';
import { getDBConnection, createTable, updateTable, getDataFromTable } from './db-service';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [tableData, setTableData] = useState([])
  const id = useId()
  useEffect(()=>{
    try{
      getDBConnection()
    }catch(e){}
    
  },[])

  useEffect(()=>{
    async function getData(){
      let fetchData = await getApiData()
      if(fetchData && fetchData.length>0){
        createTable().then((data) => {
          updateTable(fetchData).then(async(data) => {
            console.log("updated successfully");
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

  useEffect(()=>{
    async function getTableData() {
      
    }
    getTableData()
    
  },[])

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        {
          tableData && tableData.length>0 ? tableData.map((data,index)=>{
            return(<View key={data?.id+index} style={{width:300,height:100,backgroundColor:'#CCCCCC',borderRadius:5,alignSelf:'center',alignItems:'center',justifyContent:'center',marginTop:5}}>
                    <Text style={{color:'#111',fontSize:12}}>Id: {data?.id}</Text>
                    <Text style={{color:'#111',fontSize:12}}>Book name: {data?.book?.name}</Text>
                  </View>)
          }) :  <View style={{width:windowWidth,height:windowHeight,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" /></View>
        }
      </ScrollView>
      
    </SafeAreaView>
  );
}


export default App;

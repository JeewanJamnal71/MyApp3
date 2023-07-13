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
  const [showLoader, setShowLoader] = useState(true)

  useEffect(()=>{
    try{
      getDBConnection()
    }catch(e){}
    
  },[])

  const insertData=(fetchData:any)=>{
    updateTable(fetchData).then(async(data) => {   
      let tabelData = await getDataFromTable()       
      if(tabelData && tabelData.length>0){
        setTableData(tabelData)
        setShowLoader(false)
      }
    }).catch((error) => {
          console.log("update",error);
          setShowLoader(false)
      });
  }

  useEffect(()=>{
    setTableData([])
    async function getData(){
      let fetchData = await getApiData()
      if(fetchData && fetchData.length>0){
        createTable().then(async(data) => {
          if(data === "403"){ //table already there
            let tabelData = await getDataFromTable()   
              if(tabelData.length>0){   
                setTableData(tabelData)
                setShowLoader(false)
              }else{    
                insertData(fetchData)
              }
          }else{    
            insertData(fetchData)
          }
          
          })
        .catch((error) => {
          console.log("create",error);
          setShowLoader(false)
        });
      }else{
        setShowLoader(false)
      }
    }
    getData()

    return()=>setTableData([])
    
  },[])

  const filterData=async(type:string)=>{
    setShowLoader(true)
    let _filteredData = await filterDbData(type)
    if(_filteredData && _filteredData.length>0){
      setTableData(_filteredData)
      setShowLoader(false)
    }else{
      setShowLoader(false)
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
              <TouchableHighlight style={styles.buttonContainer} activeOpacity={0.6} underlayColor="#CCCCCC" onPress={()=>filterData('asc')}>
                <Text style={styles.buttonLabelStyle}>Name Ascending</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonContainer} activeOpacity={0.6} underlayColor="#CCCCCC" onPress={()=>filterData('dsc')}>
                <Text style={styles.buttonLabelStyle}>Name Decending</Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
          
          {
            showLoader ? <ActivityIndicator size="large" /> :
            tableData && tableData.length>0 ? tableData.map((data,index)=>{
              let bookObject = eval('(' + data?.book + ')');
              return(<View key={data?.id+index} style={{width:300,height:100,backgroundColor:'#CCCCCC',borderRadius:5,alignSelf:'center',alignItems:'center',justifyContent:'center',marginTop:5}}>
                      <Text style={{color:'#111',fontSize:12}}>Id: {data?.id}</Text>
                      <Text style={{color:'#111',fontSize:12}}>Book name: {bookObject?.name}</Text>
                      <Text style={{color:'#111',fontSize:12}}>Time: {data?.timePlaced}</Text>
                    </View>)
            }) :  <View style={{width:300,height:100,alignSelf:'center',alignItems:'center',justifyContent:'center',marginTop:5}}>
                    <Text style={{color:'#111',fontSize:12}}>No Data!!!!</Text>
                  </View>
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

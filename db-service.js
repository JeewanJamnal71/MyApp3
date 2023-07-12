import { Alert } from 'react-native';
import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';

  // enablePromise(true);

  var db = openDatabase({name: 'MyApp.db', location: 'default'},() => {
      console.log("Database connected!")
  }, //on success
  error => console.log("Database error", error));

  async function getDBConnection(){
    return db
  };

  async function createTable(){
    // create table if not exists
    const query = `CREATE TABLE IF NOT EXISTS BooksData (id TEXT, bettor TEXT, book TEXT,
      bettorAccount TEXT, bookRef TEXT, timePlaced TEXT, type TEXT, subtype TEXT, oddsAmerican TEXT, atRisk TEXT, toWin TEXT, status TEXT, outcome TEXT,
      refreshResponse TEXT, incomplete TEXT, netProfit TEXT, dateClosed TEXT, typeSpecial TEXT, bets TEXT, adjusted TEXT)`;
      
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(query,[],(_tx,result) => {
            console.log("Create Table Successful",result);
            resolve("Create Table Successful",);
          }, (_tx,error) => {
              console.log("Create Table error", error);
              reject(error);
          });
        })
      })

  };

  async function updateTable(dataArray){
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        dataArray.forEach((data) => {
          tx.executeSql(
            'INSERT INTO BooksData (id, bettor, book, bettorAccount, bookRef, timePlaced, type, subtype, oddsAmerican, atRisk, toWin, status, outcome, refreshResponse, incomplete, netProfit, dateClosed, typeSpecial, bets, adjusted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [JSON.stringify(data)],
            (_tx, results) => {
              console.log("records updated successfully")
              resolve('records updated successfully');
            },
            (error) => {
              console.log("error in record updation", error)
              reject(error);
              // Handle error here
            }
          );
        });
      });
    })
  };

  async function getDataFromTable(){
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM BooksData',
          [],
          (_, result) => {
            const rows = result.rows;
            const data = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              const deserializedData = JSON.parse(row.id);
              data.push(deserializedData);
            }
            resolve(data);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export {getDBConnection, createTable, updateTable, getDataFromTable}


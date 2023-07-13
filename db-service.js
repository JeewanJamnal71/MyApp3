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
    // const query = `CREATE TABLE IF NOT EXISTS BooksData (id TEXT, bettor TEXT, book TEXT,
    //   bettorAccount TEXT, bookRef TEXT, timePlaced TEXT, type TEXT, subtype TEXT, oddsAmerican TEXT, atRisk TEXT, toWin TEXT, status TEXT, outcome TEXT,
    //   refreshResponse TEXT, incomplete TEXT, netProfit TEXT, dateClosed TEXT, typeSpecial TEXT, bets TEXT, adjusted TEXT)`;
      
    const query = `CREATE TABLE IF NOT EXISTS BooksData (id VARCHAR, bettor VARCHAR, book VARCHAR,
      bettorAccount VARCHAR, bookRef VARCHAR, timePlaced VARCHAR, type VARCHAR, subtype VARCHAR, oddsAmerican VARCHAR, atRisk VARCHAR, toWin VARCHAR, status VARCHAR, outcome VARCHAR,
      refreshResponse VARCHAR, incomplete VARCHAR, netProfit VARCHAR, dateClosed VARCHAR, typeSpecial VARCHAR, bets VARCHAR, adjusted VARCHAR)`;
      

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
            [data.id, data.bettor, data.book, data.bettorAccount, data.bookRef, data.timePlaced, data.type, data.subtype, data.oddsAmerican, data.atRisk, data.toWin, data.status, data.outcome, data.refreshResponse, data.incomplete, data.netProfit, data.dateClosed, data.typeSpecial, data.bets, data.adjusted],
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
              data.push(row);
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

  async function filterDbData(type){
    return new Promise((resolve, reject) => {

      const formattedWeekStart =  type === "week" ? "2022-06-01T00:00:00Z" : type === "month" ? "2022-05-01T00:00:00Z": "2021-01-01T00:00:00Z";
      const formattedWeekEnd =  type === "week" ? "2022-06-07T00:00:00Z" : type === "month" ? "2022-05-31T00:00:00Z": "2021-12-31T00:00:00Z";

      // Execute the query with the date filter
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM BooksData where timePlaced BETWEEN ? AND ?`,
          [formattedWeekStart,formattedWeekEnd],
          (_tx, results) => {
            const rows = results.rows;
            const data = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              data.push(row);
            }
            resolve(data);
          },
          error => {
            console.error(error);
          }
        );
      });
    })
  }

  export {getDBConnection, createTable, updateTable, getDataFromTable, filterDbData}


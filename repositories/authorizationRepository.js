const dbConnection = require('../knexfile');
const knex = require("knex")(dbConnection);

function insertData (data) {
    return new Promise((resolve, reject) => {
        knex('oauth_user')
        .insert(data)
        .catch(function (error) {
            reject(error)
        })
        .then(function (insertId) {
            resolve(insertId);
        })
    })
}

function getUserToken(userid, token) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM oauth_refresh_token WHERE user_id = "${ userid }" and access_token = "${ token }"
                    and access_expiry_date > now(); `

        knex.raw(query)
            .catch(function (error) {
                reject(error)
            })
            .then(function (res) {
                if(res[0][0] != null) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }) 
    })  

}

function insertRefreshToken(refreshdata) {
    return new Promise((resolve, reject) => {
        knex('oauth_refresh_token')
        .insert(refreshdata)
        .catch( function(error) {
            reject(error)
        })
        .then(function( insertId) {
            resolve()
        })
    })
}

function getAllUsers () {
    return new Promise((resolve, reject) => {
        knex.select()
        .from('oauth_user')
        .catch(function (error) {
            reject(error);
        })
        .then(function (user) {
            resolve(user)
        })
    })
}

function getRefreshToken(token, userId) {
    return new Promise((resolve, reject) => {
        knex.select()
        .from('oauth_refresh_token')
        .where('user_id', userId)
        .andWhere('refresh_token', token)
        .andWhere('refresh_expiry_date', '>=', knex.fn.now())
        .catch(function (error) {
            reject(error)
        })
        .then(function (data) {           
            if (data) {
                resolve(data[0])
            } else {
                resolve()
            }
        })
    })
}

function updateAccessExpiry(refreshToken, accessExpiry) {
    return new Promise((resolve, reject) => {
        knex('oauth_refresh_token')
        .where({ 'refresh_token': refreshToken })
        .update({ 'access_expiry_date': accessExpiry })
        .catch(function (error) {
            reject(error)
        })
        .then(function () {
            resolve()
        })
    })
}

function removeToken(userid) {
    return new Promise((resolve, reject) => {
        let query = `DELETE FROM oauth_refresh_token WHERE user_id = "${userid}";`
        // let query = `DELETE user_access_token, user_refresh_token FROM user_access_token
        //              INNER JOIN user_refresh_token ON user_access_token.token = user_refresh_token.access_token
        //              WHERE user_access_token.token = "${token}" 
        //              and user_refresh_token.access_token = "${token}";`
        console.log(query);
        knex.raw(query)
            .catch(function (error) {
                reject(error)
            })
            .then(function() {
                resolve()
            })
    })
}

module.exports = {
    insertData,
    insertRefreshToken,
    getAllUsers,
    getRefreshToken,
    updateAccessExpiry,
    removeToken,
    getUserToken
}
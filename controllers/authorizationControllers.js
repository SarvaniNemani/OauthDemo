const axios = require('axios');
const { StatusCodes } = require("http-status-codes");
const authorizationRepository = require('../repositories/authorizationRepository');
const data = require('../helpers/constants');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

async function login(req, res) {
    const requestToken = req.query.code;
    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${data.clientID}&client_secret=${data.clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).catch((error) => {
        console.log(error.message);
    }).then((response) => {
        const accessToken = response.data.access_token;
        req.access_token = accessToken;
        const access_token = req.access_token;
        axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                Authorization: `token ${access_token}`
            },
        }).catch((error) => {
            console.log(error.message);
        }).then((response) => {
            const user = response.data;
            console.log(user);
            // get user data from github
            // save access_token and user info in db
            var refresh_token = uuidv4();
            var refreshExpiry = new moment(Date.now()).add(20, 'hours').format('YYYY-MM-DD HH:mm:ss');
            var accessExpiry = new moment(Date.now()).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
            var data = {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "location": user.location
            }
            var insertId = authorizationRepository.insertData(data);
            var refreshData = {
                "user_id": user.id,
                "refresh_token": refresh_token,
                "refresh_expiry_date": refreshExpiry,
                "access_token": access_token,
                "access_expiry_date": accessExpiry,
            }
            var reftoken = authorizationRepository.insertRefreshToken(refreshData);
            res.send({
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": user.id,
                    "username": user.name,
                    "email": user.email
                }
            })
        })
    })
}


async function getAllUsers(req, res) {

    try {
        //get user 
        let user = await authorizationRepository.getAllUsers();

        if(!user) {
            return res.status(StatusCodes.NOT_FOUND)
            .send({
                "message": "No user found"
            })
        }
        res.status(StatusCodes.OK)
        .send({
            "user": user
        })        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
            "message": error.message
        })
    }
}

async function refreshToken(req, res) {

    var refreshToken = req.body.refresh_token;

    // validate refresh token
    try {
        var refreshTokenRecord = await authorizationRepository.getRefreshToken(refreshToken, req.body.user_id);
        if (refreshTokenRecord) {
            req.refreshToken = refreshTokenRecord;
            var userId = req.body.user_id;
            // generate new access token
            var accessExpiry = new moment(Date.now()).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');            
            var updateAccessToken = await authorizationRepository.updateAccessExpiry(req.refreshToken.refresh_token, accessExpiry);
            res.status(StatusCodes.OK).send({
                "status_code": StatusCodes.OK,
            })
        } else {
            res.status(StatusCodes.OK)
                .send({
                    "status_code": StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                    "message": "Expired/Invalid refresh token. Please login again"
                })
        }
    } catch (error) {
        res.status(StatusCodes.OK)
            .send({
                "status_code": StatusCodes.INTERNAL_SERVER_ERROR,
                "message": error.message
            })
    }
}

async function logout(req, res) {
    try {
        let userId = req.params.user_id;
        // var token = req.headers['authorization'];
        
        var insertId = await authorizationRepository.removeToken(userId);
        // var insertId = await authorizationRepository.removeToken(token);
        res.status(StatusCodes.OK)
        .send({
            "message" : "logged out"
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
            "message": error.message
        })
    }
}

module.exports = {
    login,
    getAllUsers,
    refreshToken,
    logout
}
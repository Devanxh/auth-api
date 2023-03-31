const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

router.post('/signup', (req,res,next) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                error: err
            })
        }else if(!req.body.name){
            return res.status(501).json({
                error: 'Name is required'
            })
        }
        else if(!req.body.email){
            return res.status(502).json({
                error: 'Email is required'
            })
        }
        else if(!req.body.gender){
            return res.status(504).json({
                error: 'Gender is required'
            })
        }
        else if(!req.body.dob){
            return res.status(505).json({
                error: 'DOB is required'
            })
        }
        else if(!req.body.aadhar){
            return res.status(506).json({
                error: 'Aadhar is required'
            })
        }
        else if(!req.body.pan){
            return res.status(506).json({
                error: 'PAN is required'
            })
        }
        else if(!req.body.phone){
            return res.status(503).json({
                error: 'Phone no. is required'
            })
        }

        const apiPan = 'https://api.emptra.com/pan/uIdai/V5';
        var verifiedName = "";

        axios.post(apiPan, {
            "panNumber": req.body.pan
        }, {
            headers: {
                'Content-Type':'application/json',
                'Cache-Control': 'no-cache',
                'Accept': '*/*',
                'Connection':'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
                'clientId': 'b14a47320613dca60ad81af3b12aaeef:74604b2eb4b947fe298aaefdd7af8eb7',
                'secretKey': 'CDvsxkLRH5H7n4ioHZzSmHcP8UW183prerQrQsJ49Rw5IabykUsnBoVlbB23ISlbJ'
            }
        }).then((response) => {
            const verifiedName = response.data.result.name_on_card;

            console.log(verifiedName);

        if(verifiedName.toLowerCase() != (req.body.name).toLowerCase()){
            return res.status(507).json({
                error: 'Name does not match with Aadhar'
            })
        }else{
            {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    aadhar: req.body.aadhar,
                    pan: req.body.pan,
                    phone: req.body.phone
                })
    
                user.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        new_user : result
                    })
                }).catch(err => {
                    res.status(500).json({
                        error : err
                    })
                })
            }
        }
            
        }).catch((error) => {
            console.log(error);
        });



});

});

router.post('/login', (req, res, next) => {
        User.find({phone: req.body.phone})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'User Not Found. '
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(!result || err){
                    return res.status(401).json({
                        message: 'Incorrect Password'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        // payload
                        email: user[0].email,
                        name: user[0].name,
                        phone: user[0].phone
                    },
                    // secret key
                    'this is dummy text',
                    {
                        expiresIn: '24h'
                    }
                    );
                    return res.status(200).json({
                        email: user[0].email,
                        name: user[0].name,
                        phone: user[0].phone,
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(510).json({
                error: err
            })
        });
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'user route working'
})
})


module.exports = router;
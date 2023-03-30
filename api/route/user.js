const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        else if(!req.body.address){
            return res.status(503).json({
                error: 'Address is required'
            })
        }
        else if(!req.body.phone){
            return res.status(503).json({
                error: 'Phone no. is required'
            })
        }
        {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: hash,
                address: req.body.address,
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
});

});

router.post('/login', (req, res, next) => {
        User.find({email: req.body.email})
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
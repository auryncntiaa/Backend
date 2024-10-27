//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"
const { isRole } = require("../auth")

//import library
const express = require('express');
const bodyParser = require('body-parser');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require("../models/index")
const meja = models.meja

//menampilkan semua data meja
app.get("/", isRole(["admin"]), (req, res) => {
    meja.findAll()
        .then(result => {
            res.json({
                meja: result,
                count : result.length
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })  
})

//menampilkan data meja berdasarkan id
app.get("/:id_meja", isRole(["admin"]), (req, res) =>{
    meja.findOne({ where: {id_meja: req.params.id_meja}})
    .then(result => {
        res.json({
            meja: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//menambahkan data meja baru
app.post("/", isRole(["admin"]), async (req, res) => { 
    let data = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status
    }

    // Input validation untuk status
    const validStatus = ["tersedia", "tidak tersedia"];
    if (!validStatus.includes(data.status)) {
        return res.status(400).json({
            message: "Status tidak sesuai"
        });
    }

    try {
        // Cek apakah nomor meja sudah ada di database
        const existingMeja = await meja.findOne({ where: { nomor_meja: data.nomor_meja } });
        if (existingMeja) {
            return res.status(400).json({
                message: "Meja sudah tersedia"
            });
        }

        // Jika nomor meja belum ada, tambahkan meja baru
        const result = await meja.create(data);
        res.status(201).json({
            message: "Data has been inserted",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//mengubah data meja berdasarkan id
app.put("/:id", isRole(["admin"]), (req, res) =>{
    let param = { id_meja: req.params.id}
    let data = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status
    }

    //input validation selain status tersedia/tidak tersedia tidak bisa di tambahkan (daripada datanya kosong)
    const validStatus = ["tersedia", "tidak tersedia"];
    if (!validStatus.includes(data.status)) {
        res.json({
            message: "Status tidak sesuai"
        })
    } else {
        meja.update(data, {where: param})
            .then(result => {
                res.json({
                    message: "data has been updated",
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    }
})
//menghapus data meja berdasarkan id
app.delete("/:id", isRole(["admin"]), (req, res) =>{
        let param = { id_meja: req.params.id}
        // delete data
        meja.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app

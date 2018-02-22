const express = require('express');
const router = express.Router();
const pool = require('./config/db');

/* GET api listing. */
router.get('/get-info', (req, res) => {
	var id = req.query.id;
    pool.query('select * from transaction_deails where transaction_id = ?', [id], function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(500).json({ number: 'Internal error occure' });
        } else {
            if (rows.length <= 0) {
	            res.status(503).json({ amount: 'Invalid transaction id' });
	            return;
	        }
    		res.status(200).json({data: JSON.parse(rows[0].denomination_details)});
        }
    });
});


router.post('/check-card-details', (req, res) => {
    var cardNumber = req.body.number;
    var pin = req.body.pin;
    var isError = false;
    var error = {};
    if (cardNumber == null || cardNumber == '') {
        var isError = true;
        error.number = 'Card number is required';
    }
    if (pin == null || pin == '') {
        var isError = true;
        error.pin = 'Pin number is required';
    }
    if (isError) {
        res.status(400).json(error);
        return;
    }
    pool.query('select balance from card_details where card_number = ? and pin = ?', [cardNumber, pin], function(err, rows, fields) {
        if (err) {
            res.status(500).json({ number: 'Internal error occure' });
        } else {
            if (rows.length <= 0) {
                res.status(503).json({ number: 'Invalid card details' });
                return;
            }

            res.status(200).json({ message: 'Card verfied successfully', data: { balance: rows[0].balance } });
        }
    });

});

router.post('/withdraw', (req, res) => {
    var cardNumber = req.body.number;
    var pin = req.body.pin;
    var amount = req.body.amount;
    var atmId = 'SBIN0012346'; //req.body.atmId;

    var isError = false;
    var error = {};
    if (cardNumber == null || cardNumber == '') {
        var isError = true;
        error.number = 'Card number is required';
    }
    if (pin == null || pin == '') {
        var isError = true;
        error.pin = 'Pin number is required';
    }
    if (amount == null || amount == '') {
        var isError = true;
        error.amount = 'Amount is required';
    } else if (amount % 100 > 0) {
        var isError = true;
        error.amount = 'Amount should be multiple of 100';
    }
    if (isError) {
        res.status(400).json(error);
        return;
    }
    pool.query('select card_id, balance from card_details where card_number = ? and pin = ?', [cardNumber, pin], function(err, rows, fields) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (rows.length <= 0) {
                res.status(401).json({ amount: 'Invalid card details' });
                return;
            }
            var row = rows[0];
            if (row.balance < amount) {
                res.status(401).json({ amount: 'You don\'t have sufficient balance to withdraw' });
                return;
            }
            var cardId = row.card_id;
            var availAmountInATM = 0;
            pool.query('select id, currency_denomination, count from atm_details where atm_id = ?', [atmId], function(err, atmData, fields) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    if (atmData.length <= 0) {
                        res.status(503).json({ amount: 'Invalid ATM details' });
                        return;
                    }
                    var totalCounts = [];
                    for (var i = 0; i < atmData.length; i++) {
                        availAmountInATM += parseInt(atmData[i].currency_denomination * atmData[i].count);
                        totalCounts.push({ currency: atmData[i].currency_denomination, count: atmData[i].count, id: atmData[i].id });
                    }
                    if (availAmountInATM < amount) {
                        res.status(503).json({ amount: 'ATM doesn\'t have sufficient balance to withdraw' });
                        return;
                    }
                    var notes = getNoteDetails(totalCounts, amount);
                    for (var i = 0; i < notes.length; i++) {
                    	var n = notes[i];
                		if (totalCounts[i] && totalCounts[i].currency == parseInt(n.currency)) {
                    		var s = 'update atm_details set count = count - ? where id = ?';
                    		pool.query(s, [n.count, totalCounts[i].id]);
                    	}
                    }
                    var cardUpdateSql = 'update card_details set balance = balance - ? where card_id = ?';
	                pool.query(cardUpdateSql, [amount, cardId]);
                    var transSql = 'insert into transaction_deails(card_id, atm_id, denomination_details) values(?, ?, ?)';
                    pool.query(transSql, [cardId, atmId, JSON.stringify(notes)], function(err, r) {
	                    res.status(200).json({ message: 'Money withdrawlled successfully', data: r.insertId });
                    });
                }
            });
        }
    });

});


function getNoteDetails(totalCounts, amount) {
    var tempAmount = amount;
    var notes = [];
    for (var i = 0; i < totalCounts.length; i++) {
    	if (tempAmount>0) {
    		var t = totalCounts[i];
	        var tempObj = {};
	        var tempCount = Math.floor(tempAmount / t.currency);
	        if (t.count>=tempCount) {
	        	tempObj.currency = t.currency;
	        	tempObj.count = tempCount;
	        }else{
	        	tempObj.currency = t.currency;
	        	tempObj.count = t.count;
	        }
	        if (tempObj.count>0) {
	        	notes.push(tempObj)
	        }
	        tempAmount = tempAmount - (tempObj.count*t.currency);
    	}
    }
    return notes;
}
module.exports = router;
const express = require('express');
const bodyParser =require('body-parser');
const promotionRouter =express.Router();

promotionRouter.use(bodyParser.json());
promotionRouter.route('/promotions')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('will send all the promotions to you! ');
})
.post((req,res,next) => {
    res.end('will add the promotion: '+ req.body.name +' with details: '+ req.body.description)
})
.put((req,res,next) => {
    res.statusCode = 403
    res.end('PUT Operation not supported on /promotions')})
.delete((req,res,next) => {
    res.end('delete all promotions')
});

promotionRouter.route('/promotions/:promotionId')
.get((req,res,next) => {
    res.end('Will send details of the promotion: ' + req.params.promotionId +' to you!');
})

.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})

.put((req, res, next) => {
  res.write('Updating the promotion: ' + req.params.promotionId + '\n');
  res.end('Will update the promotion: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promotionId);
});

module.exports = promotionRouter;

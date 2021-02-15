const { syncAndSeed,  models:{User, Place, Thing, PurchaseRecord}} = require('./db');
const express = require('express');
const html = require("html-template-tag");
const app = express();

app.use(require('method-override')('_method'));
app.use(express.urlencoded({ extended:false}));

const init = async() =>{
  try{
     await syncAndSeed();
     const port = process.env.PORT || 1337;
     app.listen(port,()=>console.log(`Listening on port ${port}`));
  }
  catch(error){
    console.log(error)

  }
};

init();

app.get('/',async(req,res,next)=>{
    try{
        const [user,place,thing,purchaseRecord] = await Promise.all([
          User.findAll(),
          Place.findAll(),
          Thing.findAll(),
          PurchaseRecord.findAll()
        ]);
      res.send(html`
          <html>
            <head>
              <title>People, things and places</title>
            </head>
            <body>
            <div id='purchase-form'>
              Select person, place, and things!
              <form method='POST' action='/'>
                <select name='person'>
                  <option>--Person--</option>
                  ${user.map((elem) => {
                    return `<option value=${elem.name}>${elem.name}</option>`
                  })}
                </select>
                <select name='places'>
                  <option>--Places--</option>
                  ${place.map((elem) => {
                    return `<option value=${elem.name}>${elem.name}</option>`
                  })}
                </select>
                <select name='things'>
                  <option>--Things--</option>
                  ${thing.map((elem) => {
                    return `<option value=${elem.name}>${elem.name}</option>`
                  })}
                </select>
              <input type='text' name='count' placeholder='Enter count' />
              <input type='date' name='date' lang='en-us' placeholder='Enter date' />
              <button type='submit'>Create Purchase</button>
              </form>
            </div>
            <div id='activity-stream'>
                ${purchaseRecord.map((eachRecord) => {
                  return `<p>${eachRecord.purchase}</p><button type='submit'>X</button>`
                })}
            </div>
            </body>
          </html>
      `)
    }
    catch(err){
      next(err)
    }
});

app.post('/', async(req,res,next) => {
  try {
    const Record = `${req.body.person} purchased ${req.body.count} ${req.body.things} on ${req.body.date} in ${req.body.places}`
    await PurchaseRecord.create({ purchase: Record });

    const [user,place,thing,purchaseRecord] = await Promise.all([
      User.findAll(),
      Place.findAll(),
      Thing.findAll(),
      PurchaseRecord.findAll()
    ]);

    res.send(html`
    <html>
      <head>
        <title>People, things and places</title>
      </head>
      <body>
      <div id='purchase-form'>
        Select person, place, and things!
        <form method='POST' action='/'>
          <select name='person'>
            <option>--Person--</option>
            ${user.map((elem) => {
              return `<option value=${elem.name}>${elem.name}</option>`
            })}
          </select>
          <select name='places'>
            <option>--Places--</option>
            ${place.map((elem) => {
              return `<option value=${elem.name}>${elem.name}</option>`
            })}
          </select>
          <select name='things'>
            <option>--Things--</option>
            ${thing.map((elem) => {
              return `<option value=${elem.name}>${elem.name}</option>`
            })}
          </select>
        <input type='text' name='count' placeholder='Enter count' />
        <input type='date' name='date' lang='en-us' placeholder='Enter date' />
        <button type='submit'>Create Purchase</button>
        </form>
      </div>
      <div id='activity-stream'>
            ${purchaseRecord.map((eachRecord) => {
              return `<p>${eachRecord.purchase}</p><button type='submit'>X</button>`
            })}
      </div>
      </body>
    </html>
`)
  } catch(err) {
    next(err);
  }
})

const Sequelize = require('sequelize');
const {STRING} = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acmeppt',{logging:false});

const User = conn.define('user',{
    name: {
      type: STRING,
      allowNull:false,
      unique:true
    }
});
const Place = conn.define('place',{
    name: {
      type: STRING,
      allowNull:false,
      unique:true
    }
});
const Thing = conn.define('thing',{
    name: {
      type: STRING,
      allowNull:false,
      unique:true
    }
});
const PurchaseRecord = conn.define('purchases', {
    purchase: {
      type: STRING
    }
});

Thing.belongsTo(User);
Place.belongsTo(User);
Place.belongsTo(Thing);

const syncAndSeed = async()=>{
  await conn.sync({force:true});
  const [lucy, moe,larry] = await Promise.all(
      ['lucy', 'moe','larry'].map(name =>{
         return User.create({name})
      }));

  const [NYC,Chicago,LA,Dallas] = await Promise.all(
        ['NYC','Chicago','LA','Dallas'].map(name =>{
         return Place.create({name})
        }));

  const [foo, bar,bazz,quq] = await Promise.all(
      ['foo', 'bar','bazz','quq'].map(name =>{
        return Thing.create({name})
      }));

  [foo, bar, bazz, quq].forEach(action=>{
    action.update({userId:larry.id})
  });

  [NYC, Chicago, LA, Dallas].forEach(place=>{
    place.update({userId:moe.id})
  });

};

module.exports = {
    syncAndSeed,
    models:{
        User,
        Place,
        Thing,
        PurchaseRecord
    }
};
